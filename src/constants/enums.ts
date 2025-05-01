export enum ALL_PERMISSIONS {
  VIEW_DASHBOARD = "view_dashboard",
  VIEW_REPORTS = "view_reports",

  MANAGE_CUSTOMERS = "manage_customers",
  VIEW_CUSTOMERS = "view_customers",
  CREATE_CUSTOMERS = "create_customers",

  MANAGE_DRIVERS = "manage_drivers",
  VIEW_DRIVERS = "view_drivers",
  CREATE_DRIVERS = "create_drivers",

  MANAGE_VENDORS = "manage_vendors",
  VIEW_VENDORS = "view_vendors",
  CREATE_VENDORS = "create_vendors",

  MANAGE_ORDERS = "manage_orders",
  VIEW_ORDERS = "view_orders",
  CREATE_ORDERS = "create_orders",

  MANAGE_PAYMENTS = "manage_payments",
  VIEW_PAYMENTS = "view_payments",

  MANAGE_CARTS = "manage_carts",
  VIEW_CARTS = "view_carts",

  MANAGE_CHATS = "manage_chats",
  VIEW_CHATS = "view_chats",

  MANAGE_DELIVERY_REQUESTS = "manage_delivery_requests",
  VIEW_DELIVERY_REQUESTS = "view_delivery_requests",

  MANAGE_PRODUCTS = "manage_products",
  VIEW_PRODUCTS = "view_products",
  CREATE_PRODUCTS = "create_products",
  MANAGE_CATEGORIES = "manage_categories",
  VIEW_CATEGORIES = "view_categories",
  CREATE_CATEGORIES = "create_categories",

  VIEW_HELP_CENTER = "view_help_center",
}

export enum SocketEvents {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  ERROR = "error",

  USER_JOIN = "user-join",
  USER_LEAVE = "user-leave",
  USER_STATUS_UPDATE = "user-status-update",

  MESSAGE_SEND = "message-send",
  MESSAGE_RECEIVE = "message-receive",
  MESSAGE_READ = "message-read",
  MESSAGE_DELETE = "message-delete",
  MESSAGE_TYPING = "message-typing",

  NOTIFY_USER = "notify-user",
  NOTIFY_ROOM = "notify-room",
  NOTIFY_ALL = "notify-all",

  ORDER_PLACED = "order-placed",
  ORDER_STATUS_UPDATE = "order-status-update",
  PAYMENT_SUCCESS = "payment-success",
  PAYMENT_FAILED = "payment-failed",
  TRANSACTION_UPDATE = "transaction-update",

  DELIVERY_REQUEST = "delivery-request",
  DELIVERY_STATUS_UPDATE = "delivery-status-update",
  DRIVER_LOCATION_UPDATE = "driver-location-update",

  ROOM_JOIN = "room-join",
  ROOM_LEAVE = "room-leave",
  ROOM_UPDATE = "room-update",

  SYSTEM_MAINTENANCE = "system-maintenance",
  SYSTEM_ANNOUNCEMENT = "system-announcement",

  SUPPORT_TICKET_CREATED = "support-ticket-created",
  SUPPORT_TICKET_UPDATED = "support-ticket-updated",
  SUPPORT_MESSAGE = "support-message",

  FILE_UPLOADED = "file-uploaded",
  FILE_DELETED = "file-deleted",
}

export enum NotificationType {
  OTP = "OTP",
  PASSWORD_RESET = "PASSWORD_RESET",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILURE = "PAYMENT_FAILURE",
  GENERAL = "GENERAL",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
