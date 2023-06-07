import { Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "./context";
import { AvailableMicroserviceDTO, MicroserviceDTO } from "./api/dto";
import { MicrofrontendLinkingControl } from "./components";
import { isEqual, sortBy } from "lodash";

// TODO: навести красоту
const Settings = () => {
  const api = useApi();

  const { getAvailableMicroservices, getMicrofrontends, linkMicrofrontendToMicroservice, delinkMicrofrontendFromMicroservice } =
    api.microfrontendService;

  const [availableMicroservices, setAvailableMicroservices] = useState<AvailableMicroserviceDTO[]>([]);
  const [initiallyLinkedMicrofrontends, setInitiallyLinkedMicrofrontends] = useState<MicroserviceDTO[]>([]);
  const [linkedMicrofronteds, setLinkedMicrofrontends] = useState<MicroserviceDTO[]>([]);

  const getBindingData = () => {
    getAvailableMicroservices().then((res) => setAvailableMicroservices(res));
    getMicrofrontends().then((res) => {
      setInitiallyLinkedMicrofrontends(res);
      setLinkedMicrofrontends(res);
    });
  };

  useEffect(getBindingData, []);

  const saveButtonDisabled = useMemo(() => {
    const hasNotBeenChanged = isEqual(sortBy(initiallyLinkedMicrofrontends), sortBy(linkedMicrofronteds));
    let notFilledWithInfo = false;

    for (const mf of linkedMicrofronteds) {
      if (!mf.name.length || !mf.route.length || !mf.src.length) {
        notFilledWithInfo = true;
        break;
      }
    }

    return hasNotBeenChanged || notFilledWithInfo;
  }, [linkedMicrofronteds, initiallyLinkedMicrofrontends]);

  const addLinkingButtonDisabled = useMemo(
    () => availableMicroservices.filter(({ name }) => !linkedMicrofronteds.map(({ name }) => name).includes(name)).length === 0,
    [linkedMicrofronteds, initiallyLinkedMicrofrontends]
  );

  const handleSave = () => {
    const delinkedMicroservices: string[] = initiallyLinkedMicrofrontends
      .filter(({ name }) => !linkedMicrofronteds.find((linkedMf) => linkedMf.name === name))
      .map(({ name }) => name);
    const linkedMicroservices: MicroserviceDTO[] = linkedMicrofronteds.filter(
      (mf) => !initiallyLinkedMicrofrontends.find((initialMf) => isEqual(mf, initialMf))
    );

    const delinkPromises = Promise.all(delinkedMicroservices.map((name) => delinkMicrofrontendFromMicroservice(name)));
    const linkPromises = Promise.all(linkedMicroservices.map((mf) => linkMicrofrontendToMicroservice(mf)));

    Promise.all([delinkPromises, linkPromises])
      .then(() => {
        // TODO: мб не перезагружать страницу и послать запрос через шину событий, чтобы заново подтянулись все динамические микрофронты?
        location.reload();
        getBindingData();
        // TODO: при ошибке делать что ??
      })
      .catch((e) => console.error(`error occured! ${e}`));
  };

  const handleOnLinkingChange = (operationType: "add" | "delete" | "change") => (value?: MicroserviceDTO, index?: number) => {
    let newLinkedMicrofrontends: MicroserviceDTO[] = [...linkedMicrofronteds];

    switch (operationType) {
      case "add": {
        newLinkedMicrofrontends.push({
          name: "",
          src: "",
          route: "",
        });
        break;
      }
      case "change": {
        if (index >= 0) {
          newLinkedMicrofrontends[index] = value;
        }
        break;
      }
      case "delete": {
        if (index >= 0) {
          newLinkedMicrofrontends.splice(index, 1);
        } else {
          newLinkedMicrofrontends = [];
        }
        break;
      }
    }

    setLinkedMicrofrontends(newLinkedMicrofrontends);
  };

  const renderContent = (): JSX.Element => {
    if (!linkedMicrofronteds.length) {
      if (!initiallyLinkedMicrofrontends.length) {
        return (
          <Grid item xs={12}>
            {!availableMicroservices.length ? (
              <Typography>Нет активных микросервисов, к которым можно было бы осуществить биндинг</Typography>
            ) : (
              <Typography>В данный момент не создано ни одного бинда микрофронтенда к микросервису</Typography>
            )}
          </Grid>
        );
      } else {
        return (
          <Grid item xs={12}>
            <Typography>Вы удалили все бинды...</Typography>
          </Grid>
        );
      }
    } else {
      return (
        <>
          {linkedMicrofronteds.map((linkedMf, index) => {
            const availableMicroservicesToLink = availableMicroservices.filter(
              (mf) =>
                !linkedMicrofronteds
                  .map(({ name }) => name)
                  .filter((name) => linkedMf.name !== name)
                  .includes(mf.name)
            );

            return (
              <Grid key={index} item>
                <MicrofrontendLinkingControl
                  availableMicroservicesToLink={availableMicroservicesToLink}
                  currentMicrofrontend={linkedMf}
                  onChange={(value) => handleOnLinkingChange("change")(value, index)}
                  onDelete={() => handleOnLinkingChange("delete")(undefined, index)}
                />
              </Grid>
            );
          })}
        </>
      );
    }
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item>
          <Typography variant='h3'>Настройки</Typography>
        </Grid>

        <Grid item>
          <Typography variant='h6'>
            На этой странице можно привязать микрофронтенд к микросервису и назначить маршрут, по которому он будет доступен в браузере.
          </Typography>
        </Grid>

        <Grid item container spacing={1}>
          {renderContent()}
          <Grid item xs={12}>
            <Button fullWidth disabled={addLinkingButtonDisabled} onClick={() => handleOnLinkingChange("add")()}>
              Добавить бинд
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button color='error' fullWidth disabled={linkedMicrofronteds.length === 0} onClick={() => handleOnLinkingChange("delete")()}>
              Удалить все бинды
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <Button disabled={saveButtonDisabled} onClick={handleSave}>
            Сохранить
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
