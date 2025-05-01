import {
  Repository,
  DataSource,
  SelectQueryBuilder,
  EntityTarget,
  DeepPartial,
  EntityManager,
} from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";

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
}

export class BaseRepository<T> extends Repository<T> {
  private alias: string;
  protected defaultRelations: string[] = [];
  protected searchableFields: string[] = ["name"];

  constructor(private dataSource: DataSource, entity: EntityTarget<T>) {
    super(entity, dataSource.createEntityManager());
    this.alias = snakeCase(entity.toString().split(" ")[1]);
  }

  async findById(id: number): Promise<T | null> {
    return this.findOne({
      where: { id } as any,
      relations: this.defaultRelations.flatMap((relation) => {
        return relation.includes(".") ? relation.split(".")[0] : relation;
      }),
    });
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, search, sort, filters } = options;
    const queryBuilder = this.createQueryBuilder(this.alias);

    for (const relation of this.defaultRelations) {
      if (relation.includes(".")) {
        const [first, second] = relation.split(".");
        queryBuilder.leftJoinAndSelect(`${this.alias}.${first}`, first);
        queryBuilder.leftJoinAndSelect(
          `${first}.${second}`,
          `${first}_${second}`
        );
      } else {
        queryBuilder.leftJoinAndSelect(`${this.alias}.${relation}`, relation);
      }
    }

    if (search) this.applySearch(queryBuilder, search);
    if (filters) this.applyFilters(queryBuilder, filters);
    if (sort) this.applySorting(queryBuilder, sort);

    const total = await queryBuilder.getCount();
    const validLimit = Math.min(Math.max(limit, 1), 100);
    queryBuilder.skip((page - 1) * validLimit).take(validLimit);

    const data = await queryBuilder.getMany();
    return { data, total, page, limit: validLimit };
  }

  async createEntity(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.create(entity);
    return this.save(newEntity);
  }

  async updateEntity(id: number, entity: Partial<T>): Promise<T | null> {
    const existingEntity = await this.findById(id);
    if (!existingEntity) return null;

    Object.assign(existingEntity, entity);
    return this.save(existingEntity);
  }

  async deleteEntity(id: number): Promise<boolean> {
    const result = await this.softDelete(id);
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
        return `LOWER(${this.alias}.${field}) LIKE LOWER(:search)`;
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
        queryBuilder.andWhere(`${this.alias}.${field} IN (:...${field})`, {
          [field]: value,
        });
      } else {
        queryBuilder.andWhere(`${this.alias}.${field} = :${field}`, {
          [field]: value,
        });
      }
    });
  }

  protected applySorting(queryBuilder: SelectQueryBuilder<T>, sort: string) {
    const sortFields = sort.split(",").map((s) => s.trim());

    sortFields.forEach((sortField) => {
      const [field, order] = sortField.split(":");
      const validOrder = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      queryBuilder.addOrderBy(
        `${this.alias}.${field}`,
        validOrder as "ASC" | "DESC"
      );
    });
  }
}
