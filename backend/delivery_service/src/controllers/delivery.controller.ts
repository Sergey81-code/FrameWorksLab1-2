import { Request, Response } from "express";
import * as DeliveryService from "../services/delivery.service";
import { CreateDeliveryDto, UpdateDeliveryDto } from "@lab1_2/types";

const getParamString = (param: string | string[] | undefined): string => {
  if (!param) throw new Error("Param is required");
  return Array.isArray(param) ? param[0] : param;
};

export const getAllDeliveries = async (_req: Request, res: Response) => {
  const deliveries = await DeliveryService.getDeliveries();
  res.json(deliveries);
};

export const getDeliveryById = async (req: Request, res: Response) => {
  const deliveryId = getParamString(req.params.id);
  const delivery = await DeliveryService.getDelivery(deliveryId);
  res.json(delivery);
};

export const createDelivery = async (req: Request, res: Response) => {
  const data: CreateDeliveryDto = req.body;
  const delivery = await DeliveryService.createDelivery(data);
  res.json(delivery);
};

export const updateDelivery = async (req: Request, res: Response) => {
  const deliveryId = getParamString(req.params.id);
  const data: UpdateDeliveryDto = req.body;
  const delivery = await DeliveryService.updateDelivery(deliveryId, data);
  res.json(delivery);
};

export const deleteDelivery = async (req: Request, res: Response) => {
  const deliveryId = getParamString(req.params.id);
  await DeliveryService.deleteDelivery(deliveryId);
  res.json({ success: true });
};