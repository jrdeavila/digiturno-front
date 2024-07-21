import QualificationModuleService from "./qualification-module-service";

export default function useQualificationModule() {
  return QualificationModuleService.getInstance();
}
