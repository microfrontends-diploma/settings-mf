import { Card, CardContent, CardHeader, Grid, IconButton, Input, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { MicroserviceDTO } from "src/api/dto";
import CloseIcon from '@mui/icons-material/Close';
import { MicrofrontendLinkingControlProps } from "./types";

const MicrofrontendLinkingControl = ({
  availableMicroservicesToLink,
  currentMicrofrontend,
  index,
  onChange,
  onDelete,
}: MicrofrontendLinkingControlProps) => {
  const targetMicroserviceDisabled =
    availableMicroservicesToLink.find((mf) => mf.name === currentMicrofrontend.name)?.status === "inactive";

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

  const closeButton = (
    <Tooltip title='Удалить бинд' placement="top">
      <IconButton sx={{color: 'white'}} onClick={onDelete}>
        <CloseIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Card sx={{backgroundColor: 'primary.main'}}>
      <CardHeader sx={{color: 'white'}} action={closeButton} title={`Бинд №${index}`}/>
      <CardContent sx={{backgroundColor: 'white'}}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography sx={{fontWeight: '600', color: 'primary.main'}}>Доступные микросервисы</Typography>
            <Select
              fullWidth
              value={currentMicrofrontend.name}
              onChange={(ev) => handleFieldChange("name")(ev.target.value)}
              disabled={targetMicroserviceDisabled}
            >
              {availableMicroservicesToLink.map((mf) => (
                <MenuItem key={mf.name} value={mf.name}>
                  {mf.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{fontWeight: '600', color: 'primary.main'}}>URL для подгрузки микрофронтенда</Typography>
            <Input
              fullWidth
              value={currentMicrofrontend.src}
              onChange={(ev) => handleFieldChange("src")(ev.target.value)}
              disabled={targetMicroserviceDisabled}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{fontWeight: '600', color: 'primary.main'}}>Путь в браузере, по которому микрофронтенд будет доступен</Typography>
            <Input
              fullWidth
              value={currentMicrofrontend.route}
              onChange={(ev) => handleFieldChange("route")(ev.target.value)}
              disabled={targetMicroserviceDisabled}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    
  );
};

export default MicrofrontendLinkingControl;
