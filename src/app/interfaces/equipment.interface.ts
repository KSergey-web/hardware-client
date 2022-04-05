import { equipmentTypeEnum } from "../enums/equipments.enum";

export interface IEquipment {
  id: number;
  server_url?: string;
  stream_url?: string;
  name: string;
  type?: equipmentTypeEnum;
}
