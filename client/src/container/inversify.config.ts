import "reflect-metadata";
import { Container } from "inversify";
import { configModule } from "./containers/config/config.module";
import { networkModule } from "./containers/network/network.module";
import { servicesModule } from "./containers/services/service.module";
import { useCasesModule } from "./containers/use-cases/use-cases.module";

// Contenedor principal. El orden importa: config y services se cargan antes de
// network/use-cases porque estos dependen de aquellos.
const appContainer = new Container();
appContainer.load(configModule);
appContainer.load(networkModule);
appContainer.load(servicesModule);
appContainer.load(useCasesModule);

export { appContainer };
