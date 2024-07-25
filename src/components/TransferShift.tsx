import AttentionProfile from "@/models/attention-profile";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { useState } from "react";

const TransferShift: React.FC<{
  onCancel: () => void;
  onTransfer: (profile: AttentionProfile) => void;
}> = ({ onCancel, onTransfer }) => {
  const { attentionProfiles } = useAttentionProfileResource();
  const [selectedProfile, setSelectedProfile] =
    useState<AttentionProfile | null>(null);
  return (
    <Card>
      <CardHeader>
        <span className="text-2xl font-bold">TRANSFERIR TURNO</span>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-y-2">
          <p>¿A qué operador deseas transferir el turno?</p>
          <div className="flex flex-col gap-y-2">
            {attentionProfiles.map((profile) => (
              <div key={profile.id} className="flex flex-row gap-x-2">
                <input
                  type="radio"
                  id={profile.id.toString()}
                  name="transfer"
                  onChange={() => setSelectedProfile(profile)}
                />
                <label htmlFor={profile.id.toString()}>{profile.name}</label>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex flex-row justify-center items-center w-full gap-x-3">
          <Button
            onClick={() => {
              onCancel();
            }}
            className="btn btn-primary font-bold"
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              onTransfer(selectedProfile!);
            }}
            className="btn btn-primary font-bold bg-primary text-white"
          >
            TRANSFERIR
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransferShift;
