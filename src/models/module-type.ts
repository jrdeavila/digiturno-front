import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default interface ModuleType {
  id: number;
  name: string;
  icon: IconProp;
  useQualification: boolean;
}
