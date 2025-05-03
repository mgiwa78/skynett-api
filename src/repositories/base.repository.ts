import {
  Repository,
  DataSource,
  SelectQueryBuilder,
  EntityTarget,
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  FindOneOptions,
  FindManyOptions,
} from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";
import { BaseEntity } from "../database/entities/base.entity";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseRepository<T> extends Repository<T> {
  protected defaultRelations: string[] = [];
  protected searchableFields: string[] = ["name"];

  constructor(private dataSource: DataSource, entity: EntityTarget<T>) {
    super(entity, dataSource.createEntityManager());
  }

  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data as DeepPartial<T>);
    return this.save(entity);
  }

  async findById(
    id: string,
    relations: string[] = this.defaultRelations
  ): Promise<T | null> {
    return this.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      relations,
    } as FindOneOptions<T>);
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, search, sort, filters } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder("entity");

    // Apply relations
    this.defaultRelations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    });

    // Apply search if provided
    if (search) {
      const searchableColumns = this.getSearchableColumns();
      const searchConditions = searchableColumns.map((column) => {
        return `entity.${column} ILIKE :search`;
      });
      queryBuilder.where(`(${searchConditions.join(" OR ")})`, {
        search: `%${search}%`,
      });
    }

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
        }
      });
    }

    // Apply sorting if provided
    if (sort) {
      const [field, order] = sort.split(":");
      queryBuilder.orderBy(`entity.${field}`, order as "ASC" | "DESC");
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateEntity(id: string, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) return null;

    Object.assign(entity, data);
    return this.save(entity);
  }

  async deleteEntity(id: any): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0;
  }

  protected applySearch(queryBuilder: SelectQueryBuilder<T>, search: string) {
    const fields = this.searchableFields;
    const conditions = fields
      .map((field) => {
        if (field.includes(".")) {
          const [joinAlias, column] = field.split(".");
          return `LOWER(${joinAlias}.${column}) LIKE LOWER(:search)`;
        }
        return `LOWER(${this.metadata.tableName}.${field}) LIKE LOWER(:search)`;
      })
      .join(" OR ");
    queryBuilder.andWhere(`(${conditions})`, { search: `%${search}%` });
  }

  protected applyFilters(
    queryBuilder: SelectQueryBuilder<T>,
    filters: Record<string, any>
  ) {
    Object.entries(filters).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        queryBuilder.andWhere(
          `${this.metadata.tableName}.${field} IN (:...${field})`,
          {
            [field]: value,
          }
        );
      } else {
        queryBuilder.andWhere(
          `${this.metadata.tableName}.${field} = :${field}`,
          {
            [field]: value,
          }
        );
      }
    });
  }

  protected applySorting(queryBuilder: SelectQueryBuilder<T>, sort: string) {
    const sortFields = sort.split(",").map((s) => s.trim());

    sortFields.forEach((sortField) => {
      const [field, order] = sortField.split(":");
      const validOrder = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      queryBuilder.addOrderBy(
        `${this.metadata.tableName}.${field}`,
        validOrder as "ASC" | "DESC"
      );
    });
  }

  protected getSearchableColumns(): string[] {
    return [];
  }
}
