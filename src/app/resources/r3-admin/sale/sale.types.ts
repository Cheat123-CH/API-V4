import { Pagination } from "@app/shared/pagination.interface";
import Order from "@models/order/order.model";

export interface List {
    status: string;
    data: Order[];
    pagination: Pagination;
}
