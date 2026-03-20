import { Request, Response } from "express";
import * as OrderService from "../services/order.service";
import { CreateOrderDto, UpdateOrderDto } from "@lab1_2/types";

const getParamString = (param: string | string[] | undefined): string => {
  if (!param) throw new Error("Param is required");
  return Array.isArray(param) ? param[0] : param;
};

export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await OrderService.getOrders();
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = getParamString(req.params.id);
  const order = await OrderService.getOrder(orderId);
  res.json(order);
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  const userId = getParamString(req.params.userId);
  const orders = await OrderService.getOrdersByUserId(userId);
  res.json(orders);
};

export const createOrder = async (req: Request, res: Response) => {
  const data: CreateOrderDto = req.body;
  const order = await OrderService.createOrder(data);
  res.json(order);
};

export const updateOrder = async (req: Request, res: Response) => {
  const orderId = getParamString(req.params.id);
  const data: UpdateOrderDto = req.body;
  const order = await OrderService.updateOrder(orderId, data);
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const orderId = getParamString(req.params.id);
  await OrderService.deleteOrder(orderId);
  res.json({ success: true });
};