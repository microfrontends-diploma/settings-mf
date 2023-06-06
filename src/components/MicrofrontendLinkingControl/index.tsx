import React from "react";
import { Button, Grid, Input, MenuItem, Select, Typography } from "@mui/material";
import { AvailableMicroserviceDTO, MicroserviceDTO } from "src/api/dto";

type MicrofrontendLinkingControlProps = {
  availableMicroservicesToLink: AvailableMicroserviceDTO[];
  currentMicrofrontend: MicroserviceDTO;
  onChange: (value: MicroserviceDTO) => void;
  onDelete: () => void;
};

const MicrofrontendLinkingControl = ({
  availableMicroservicesToLink,
  currentMicrofrontend,
  onChange,
  onDelete,
}: MicrofrontendLinkingControlProps) => {
  const targetMicroserviceDisabled = availableMicroservicesToLink.find((mf) => mf.name === currentMicrofrontend.name)?.status === "inactive";

  const handleFieldChange = (key: Omit<keyof MicroserviceDTO, "styles">) => (value: string) => {
    switch (key) {
      case "name": {
        onChange({
          name: value,
          src: "",
          route: "",
        });
        break;
      }
      case "src":
      case "route": {
        onChange({
          ...currentMicrofrontend,
          [key as keyof MicroserviceDTO]: value,
        });
      }
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography>Доступные микросервисы</Typography>
        <Select value={currentMicrofrontend.name} onChange={(ev) => handleFieldChange("name")(ev.target.value)} disabled={targetMicroserviceDisabled}> 
          {availableMicroservicesToLink.map((mf) => (<MenuItem key={mf.name} value={mf.name}>{mf.name}</MenuItem>))}
        </Select>
      </Grid>
      <Grid item>
        <Typography>URL для подгрузки микрофронтенда</Typography>
        <Input value={currentMicrofrontend.src} onChange={(ev) => handleFieldChange("src")(ev.target.value)} disabled={targetMicroserviceDisabled} />
      </Grid>
      <Grid item>
        <Typography>Путь в браузере, по которому микрофронтенд будет доступен</Typography>
        <Input value={currentMicrofrontend.route} onChange={(ev) => handleFieldChange("route")(ev.target.value)} disabled={targetMicroserviceDisabled} />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={onDelete}>Удалить бинд</Button>
      </Grid>
    </Grid>
  );
};

export default MicrofrontendLinkingControl;
