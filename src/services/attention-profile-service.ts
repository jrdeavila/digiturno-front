import {
  AttentionProfileResponse,
  mapAttentionProfile,
} from "@/data/attention-profile-mappings";
import AttentionProfile from "@/models/attention-profile";
import { AxiosInstance } from "axios";

export default class AttentionProfileService {
  httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async getAll(ipAddress: string): Promise<AttentionProfile[]> {
    const response = await this.httpClient.get<{
      data: AttentionProfileResponse[];
    }>("/attention_profiles", {
      headers: {
        "X-Module-Ip": ipAddress,
      }
    });
    const attentionProfiles = response.data.data.map(mapAttentionProfile);
    return attentionProfiles;
  }
}
