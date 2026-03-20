import * as OrderRepository from "../repositories/order.repository";
import { CreateOrderDto, UpdateOrderDto, OrderResponse } from "@lab1_2/types";
import { OrderNotFoundError, OrderCreateFailed, OrderUpdateFailed, OrderDeleteFailed } from "../errors/order.errors";

const toOrderResponse = (o: any): OrderResponse => ({
  id: o.id,
  user_id: o.user_id,
  status: o.status,
  total: parseFloat(o.total),
  created_at: o.created_at.toISOString(),
  items: o.items.map((i: any) => ({
    product_id: i.product_id,
    quantity: i.quantity,
    price: parseFloat(i.price),
  }))
});

export const getOrders = async () => {
  const orders = await OrderRepository.findAll();
  return orders.map(toOrderResponse);
};

export const getOrder = async (id: string) => {
  const order = await OrderRepository.findById(id);
  if (!order) throw new OrderNotFoundError();
  return toOrderResponse(order);
};


export const getOrdersByUserId = async (user_id: string) => {
  const orders = await OrderRepository.findByUserId(user_id);
  return orders.map(toOrderResponse);
};


export const createOrder = async (data: CreateOrderDto) => {
  const order = await OrderRepository.createOrder(data);
  if (!order) throw new OrderCreateFailed();
  return toOrderResponse(order);
};

export const updateOrder = async (id: string, data: UpdateOrderDto) => {
  const order = await OrderRepository.findById(id);
  if (!order) throw new OrderNotFoundError();

  const updated = await OrderRepository.updateOrder(id, data);
  if (!updated) throw new OrderUpdateFailed();
  return toOrderResponse(updated);
};

export const deleteOrder = async (id: string) => {
  const order = await OrderRepository.findById(id);
  if (!order) throw new OrderNotFoundError();

  const deleted = await OrderRepository.deleteOrder(id);
  if (!deleted) throw new OrderDeleteFailed();
  return deleted;
};