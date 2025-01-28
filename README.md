# Desafio Back-end Sênior - [Verx Tecnologia](https://www.verx.com.br/)

## Descrição

Este projeto é a minha proposta de solução a um desafio da Verx Tecnologia. Onde a descrição do mesmo pode ser [acessada aqui](https://github.com/brain-ag/trabalhe-conosco). Mas de forma geral, o desafio consiste em criar uma API RESTful, usando Nestjs com Typescript, para prover uma API para gerenciamento de Produtores rurais, bem como suas propriedades rurais, e em qual safra a propriedade está e quais culturas foram plantadas na mesma.

## Tecnologias utilizadas no projeto
* NodeJs
* ExpressJs
* NestJs
* MikroORM
* Docker e docker-compose
* PostgreSQL
* Swagger
* Class Transformer e Class Validator
* Typescript
* Zod
* Entre outros

## Acesso a aplicação em produção

URL da API: https://verx-challenge.onrender.com

URL da doc da API: https://verx-challenge.onrender.com/docs

**Observação**: ao acessar a aplicação pela primeira vez, ela pode demorar um pouco a responder, pois a mesma está hospedada por meio de serviços gratuitos, que dado um tempo de ociosidade, o serviço entra em hibernação para economia de recursos, quando o serviço volta a ser requisitado, é que a infraestrutura sobe novamente, para o dispor para acessos.

## MER do Banco de dados
<div align="center">
  
  ![verx-challenge-mer drawio](https://github.com/user-attachments/assets/b970ad6d-fd1a-490f-8b6a-f7ee1fdf6fcc)
  
</div>

## Arquitetura do projeto

Para a implementação do projeto utilizei Nodejs em conjunto com o framewok Nestjs, MikroORM como ORM para o banco de dados, no qual utilizei para persistir os dados o PostgreSQL na versão 17, todo o projeto foi implementado utilizando Typescript.

A arquitetura do projeto está basicamente focada dentro da pasta *src*, a baixo segue a estrutura de pastas do projeto bem como a organização dos arquivos do mesmo:

```
src
 -- app     // Pasta que contem toda a configuração geral da aplicação Nestjs, desde de conexão com banco de dados, injeção dos modulos da aplicação para funcionamento, mapeamento das entidades da aplicação.
 -- config  // Pasta quem contem todos os arquivos de configuração da aplicação, sejam decorators customizados, classes de configuração e etc.
 -- modules // Pasta que contem todos os módulos da aplicação, que neste domínio é Crop(Cultura), Harvest(Safra)...
 -- shared  // Pasta que contem todos os arquivos que são compartilhados por toda a aplicação, sejam mensagens constantes, tipos e ou funções gerais que são utilizadas por toda a aplicação.
```

Analisando a pasta *src/app* em específico:
```
app
 - app.module.ts // Arquivo de configuração deste módulo, que no caso é o módulo principal da aplição, no dado arquivo é configurado e lincado os demais módulos da aplicação, bem como todas as entidades da aplição e demais configurações de use cases e/ou bibliotecas que irão ser utilizados por todo o restande a aplicação.
```
Analisando a pasta *src/config* em específico:
```
config
 -- decorators                // Pasta de contem todos os decorators personalizados, que foram criados basedos nas necessidades do projeto.
   - IsCpfOrCnpjValidator.ts  // Decorator utilizando class validator e a lib cpf-cnpj-validator, para dispor um decorator personalizado especializado em executar essa validação, para ser utilizado nas classes DTO.
   - UUIDQueryParamsPipe.ts   // Decorator utilizando class validator e as pipes do Nests, para prover um decorator personalizado, para identificar um atributo opcional na request, e verificar se o tipo do mesmo é realmente UUID.
 -- environment               // Pasta de contem tudo as variáveis de ambiente do projeto.
   - env.ts                   // Arquivo utilizando zod, no qual contém um schema zod para validar os valores do *.env*, e os dispor para o restante da aplicação em formato de objeto e já devidamente tipado.
 -- swagger                   // Pasta que contém toda a configuração do Swagger da aplicação.
   - constants.ts             // Arquivo de constantes utilizados na configuração do Swagger, bem como descrição, versão e algumas outras informações.
   - contract.ts              // Arquivo de interface/contrato, que define qual o molde comportamental, que a classe de configuração do Swagger deve ter.
   - Swagger.ts               // Classe de configuração do Swagger, seguindo o arquivo de contrato, bem com fazendo uso do arquivo de constantes, para disponibilizar a feature de documentação via Swagger para o projeto.
```

Analisando a pasta *src/modules* em específico:
```
modules
 -- crop             // Pasta de contem tudo sobre o módulo de Crop(Cultura), basicamente, tudo neste módulo é referente a funcionalidade de busca de todas as culturas, bem como algumas validações importantes do domínio de culturas.
 -- harvest          // Pasta de contem tudo sobre o módulo de Harvest(Safra), basicamente, tudo neste módulo é referente a funcionalidade de busca de todas as safras.
 -- producer         // Pasta de contem tudo sobre o módulo de Producer(Produtor), basicamente, tudo neste módulo é referente as funcionalidades do produtor, seja criação, listagem, atualização ou deleção.
 -- rural_propertie  // Pasta de contem tudo sobre o módulo de Rural Propertie(Propriedade Rural), basicamente, tudo neste módulo é referente a funcionalidade de busca uma propriedade por ID do produtor e obtenção os dados para a dashboard.
```
De forma estrutural todas os módulos possuem estruturas semelhantes em termo de organização e estrutura de pastas, a diferença é que cada módulo trata das regras de negócio de sua entidade, no máximo de uma outra entidade correlata ou relacionada a sua própria.
Abaixo irei exemplificar a estrutura geral de qualquer um dos módulos:
```
nome-do-modulo
  -- controller                         // Pasta responsável por abrigar as implementações que gerenciam as requisições HTTP, nesse caso, os Controllers do módulo.
     - example.controller.e2e-spec.ts   // Arquivo que contém os testes de integração do controller.
     - Example.controller.ts            // Classe Controller do módulo, onde por meio do mesmo, são expostas as rotas da aplicação do módulo.
  -- dto                                // Pasta que contem todas as definições das DTOs (Data Transfer Object) do projeto, podendo ser as DTOs contratos/interfaces ou classes propriamente ditas, com foco em tipar um dado, seja o mesmo de entrada ou saída.
     - ExampleDTO.ts                    // Classe DTO, utilizada para definir os contratos de entrada de cada rota dos controllers da aplicação.
  -- entity                             // Pasta que contem as definições das entidades do módulo que são gerenciadas pelo ORM. Pode haver mais de uma entidade por módulo.
     - Entity.ts                        // Classe que modela uma entidade, para uma tabela do banco de dados, essa entidade é utilizada pelo repositório, para prover as features de alteração em banco de dados.
  -- error                              // Pasta que contem todas as definições de classes de erro do domínio do módulo.
     - Error.ts                         // Classe que modela, um erro do domínio.
  -- provider                           // Pasta que contem os provedores de funcionalidades globais do módulo, como implementações genéricas que são utilizadas por mais de um local no módulo, ou uma implementação de uma regra de negócio que pode sofrer alterações posteriores, como por exemplo: uma funcionalidade atrelada a uma tecnologia/biblioteca X por exemplo, que posteriormente poderá ser alterada, a mesma já pensada para isolar partes da regra de negócio guiadas a contratos, para já proteger o projeto das famosas variações protegidas, que mesmo que a regra de negócio seja alterada, o contrato de implementação é o mesmo, assim no restante do código do projeto não haverá reflexo algum. OBS: Essa pasta é opcional, nem todos os módulos conterão a mesma, pois nem todos necessitam da existência de provedores mais customizados de dadas funcionalidades ou regras de negócio.
    -- example-provider                 // Pasta que contem um provedor de funcionalidade.
      - IExampleProvider.ts             // Arquivo Typescript de contrato/interface deste dado proveedor.
      -- implementation                 // Pasta que contem a implementação desde dado provedor de funcionalidade.
        - ExampleProvider.ts            // Arquivo que segue o contrato definido por este dado provedor, e implementa a dada regra de negócio guiada ao contrato que foi previamente definido.
  -- repository                         // Pasta que contém todas as definições dos repositórios do módulo, repositório esse que se utiliza da entidade, para prover as funcionalidades de alteração em registros de dados, que por sua vez, estão no banco de dados.
    - IExampleRepository.ts             // Arquivo Typescript de contrato/interface deste dado repository.
    -- implementation                   // Pasta que contem a implementação desde dado repository.
      - ExampleRepository.ts            // Arquivo que segue o contrato definido por este dado repository, e implementa a dada regra de negócio guiada ao contrato que foi previamente definido.
      - example.repository.spec.ts      // Arquivo de testes de unidade deste dado repository.
  -- use-case                           // Pasta que armazena todos os use cases da aplicação, que gerenciam os dados coletados pelo controlador da requisição HTTP, aplicada as regras de negócio sobre os mesmos, realizam suas operaçãoes no banco de dados por meio dos repositories, e realizam o retorno do resultado da operação para o Controller que devolve para o requisitante.
      - IExampleUseCase.ts              // Arquivo Typescript de contrato/interface deste dado use case.
    -- implementation                   // Pasta que contem a implementação desde dado use case.
      - ExampleUseCase.ts               // Arquivo que segue o contrato definido por este dado use case, e implementa a dada regra de negócio guiada ao contrato que foi previamente definido.
      - example.use-case.spec.ts        // Arquivo de testes de unidade deste dado use case.
  nome-do-modulo.modules.ts             // Arquivo que configura tudo que tem/é utilizado no módulo, como os use cases, controladores do módulo, providers, bem como as entidades com as quais o mesmo irá trabalhar. Bem como as definições de quais de suas funcionalidades outros módulos da aplicação podem ou não utilizar.
```

Por fim, iremos dar uma olhada na pasta *shared*, que é onde contem os arquivos compartilhados da aplicação, em *src/shared*:
```
shared
 -- messages  // Pasta que contém todas as constantes de mensagens que são utilizadas por toda a aplicação, sejam em controllers, classes de erro do domínio, use cases e etc.
 -- types     // Pasta que contém todos os tipos globais da aplicação, sendo classes, types e ou interfaces, que são utilizadas por todos os módulos da aplicação.
 -- utils     // Pasta que contem todas as funções uteis da aplicação, nas quais são utilizadas por todos os módulos.
```

Exemplificando o padrão de acesso aos dados da aplicação:

```
Requisição HTTP -> Controller -> Use Case -> Repository -> Entity
```

## Requisitos para executar o projeto
* Ter o Node instalado em sua máquina.
* Ter o gerenciador de pacotes PNPM ou NPM instalado em sua máquina.
* Ter o Git instalado em sua máquina.
* Ter o Docker instalado em sua máquina.
* Ter o docker-compose instalado em sua máquina.

## Como executar o projeto

Primeiro faça um clone do projeto para sua máquina, assim escolha um local em seu computador que acha adequado para tal, e siga os passos/comandos a baixo em um terminal de sua preferência, executando um por vez, uma após o final da execução do outro:
```bash
git clone https://github.com/ericrodriguesfer/verx-challenge.git

cd verx-challenge

# Use um desses quatro comandos a baixo, ambos fazem a mesma coisa
pnpm i        # Opção 01
pnpm install  # Opção 02
npm i         # Opção 03
npm install   # Opção 04
```

Com isso terá clonado o projeto em sua máquina e instalado todas as dependências necessárias para ele funcionar.
Agora iremos configurar a parte de infraestrutura do projeto, mas fica tranquilo que estamos utilizando Docker, e isso irá simplificar seu trabalho.

A seguir, deve-se definir um arquivo *.env*, para armazenar os valores, das variáveis de ambiente da aplicação, na raiz do projeto, tem um arquivo chamado *.env.example*, basta seguir o mesmo padrão que está ali, inserir os valores que mais se adequa ao seu uso, que tanto a aplicação quanto o Docker, vai fazer uso desses valores.

Para executar o projeto, execute o seguinte comando:

```bash
docker-compose up -d
```
Após isso, o Docker irá executar os passos definidos e configurados para o projeto, e uma primeira execução esse processo pode demorar um pouco, mas a partir de uma segunda vez, esse processo é rápido, quando tudo der certo e for concluído em seu terminal aparecerá o seguinte:

```bash
Creating network "verx-challenge_verx-challenge" with driver "bridge"
Creating database-verx-challenge ... done
Creating verx-challenge-api      ... done
```

Após isso você já pode realizar a utilização e exploração do projeto, caso tenha seguido todo o passo a passo como segueri, a aplicação estará rodando na seguinte url em sua máquina: http://localhost:PORT, (sendo **PORT**, o valor que foi definido na variável **PORT** do seu arquivo *.env*), caso deseje acessar a documentação da api que foi feita com Swagger, acesse a seguinte url em sua máquina: http://localhost:PORT/docs.

## Execução dos testes

Os casos de testes foram implementados para os locais da aplicação onde são executadas e tratadas as regras de negócios do domínio.

Em seu terminal, digite o seguinte comando:
```bash
# Existes algumas formas de rodar o comando, irei listas algumas, use a que preferir
pnpm test         # Opção 01
npm run test      # Opção 02
npm test          # Opção 03
```
Caso tudo dê certo, você irá receber a seguinte/ou semelhante saída em seu terminal:
```bash
➜  pnpm test

> verx-challenge@0.0.1 test /home/eric/Estudos/verx-challenge
> jest

 PASS  src/modules/harvest/use-case/implementation/list-all-harvest.use-case.spec.ts (6.917 s)
 PASS  src/modules/harvest/controller/harvest.controller.e2e-spec.ts (6.995 s)
 PASS  src/modules/producer/use-case/implementation/update-producer.use-case.spec.ts (6.983 s)
 PASS  src/modules/rural_propertie/use-case/implementation/get-data-dashboard.use-case.spec.ts (7.056 s)
 PASS  src/modules/producer/use-case/implementation/list-all-producers.use-case.spec.ts (7.227 s)
 PASS  src/modules/harvest/repository/implementation/harvest.repository.spec.ts
 PASS  src/modules/crop/repository/implementation/crop.repository.spec.ts
 PASS  src/modules/rural_propertie/controller/rural-propertie.controller.e2e-spec.ts (7.61 s)
 PASS  src/modules/crop/use-case/implementation/list-all-crops.use-case.spec.ts (7.598 s)
 PASS  src/modules/producer/repository/implementation/producer.repository.spec.ts
 PASS  src/modules/producer/use-case/implementation/delete-producer.use-case.spec.ts (7.777 s)
 PASS  src/modules/crop/repository/implementation/crops-planted.repository.spec.ts
 PASS  src/modules/rural_propertie/repository/implementation/rural-propertie.repository.spec.ts
 PASS  src/modules/producer/use-case/implementation/create-producer.use-case.spec.ts (7.831 s)
 PASS  src/modules/crop/controller/crop.controller.e2e-spec.ts (8.036 s)
 PASS  src/modules/producer/controller/producer.controller.e2e-spec.ts (8.05 s)

Test Suites: 16 passed, 16 total
Tests:       67 passed, 67 total
Snapshots:   0 total
Time:        8.348 s, estimated 9 s
Ran all test suites.
```

Caso queria dar uma olhada na cobertura dos testes, basta executar algum dos seguintes comandos listados a seguir:
```bash
# Existes algumas formas de rodar o comando, irei listas algumas, use a que preferir
pnpm test:cov         # Opção 01
npm run test:cov      # Opção 02
npm test:cov          # Opção 03
```

Tudo dando certo, terá esse resultado em seu terminal:
```bash
➜  pnpm test:cov

> verx-challenge@0.0.1 test:cov /home/eric/Estudos/verx-challenge
> jest --coverage

 PASS  src/modules/harvest/use-case/implementation/list-all-harvest.use-case.spec.ts (6.614 s)
 PASS  src/modules/crop/use-case/implementation/list-all-crops.use-case.spec.ts (6.908 s)
 PASS  src/modules/producer/use-case/implementation/delete-producer.use-case.spec.ts (6.97 s)
 PASS  src/modules/producer/repository/implementation/producer.repository.spec.ts
 PASS  src/modules/producer/use-case/implementation/list-all-producers.use-case.spec.ts (7.225 s)
 PASS  src/modules/rural_propertie/use-case/implementation/get-data-dashboard.use-case.spec.ts (7.127 s)
 PASS  src/modules/harvest/controller/harvest.controller.e2e-spec.ts (7.472 s)
 PASS  src/modules/crop/repository/implementation/crop.repository.spec.ts
 PASS  src/modules/rural_propertie/repository/implementation/rural-propertie.repository.spec.ts
 PASS  src/modules/rural_propertie/controller/rural-propertie.controller.e2e-spec.ts (7.559 s)
 PASS  src/modules/crop/repository/implementation/crops-planted.repository.spec.ts
 PASS  src/modules/producer/use-case/implementation/create-producer.use-case.spec.ts (7.7 s)
 PASS  src/modules/crop/controller/crop.controller.e2e-spec.ts (7.699 s)
 PASS  src/modules/harvest/repository/implementation/harvest.repository.spec.ts
 PASS  src/modules/producer/use-case/implementation/update-producer.use-case.spec.ts (7.704 s)
 PASS  src/modules/producer/controller/producer.controller.e2e-spec.ts (8.095 s)
--------------------------------------------------------------------|---------|----------|---------|---------|-------------------------
File                                                                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------------------------------------|---------|----------|---------|---------|-------------------------
All files                                                           |   80.18 |       80 |   63.77 |   81.04 |
 src                                                                |       0 |        0 |       0 |       0 |
  main.ts                                                           |       0 |        0 |       0 |       0 | 1-32
 src/app                                                            |       0 |      100 |     100 |       0 |
  app.module.ts                                                     |       0 |      100 |     100 |       0 | 1-39
 src/config/decorators                                              |   71.42 |    16.66 |      60 |   68.75 |
  IsCpfOrCnpjValidator.ts                                           |   61.53 |        0 |      50 |      60 | 12-18
  UUIDQueryParamsPipe.ts                                            |    87.5 |    33.33 |     100 |   83.33 | 15
 src/config/environment                                             |       0 |      100 |     100 |       0 |
  env.ts                                                            |       0 |      100 |     100 |       0 | 1-18
 src/config/swagger                                                 |       0 |      100 |       0 |       0 |
  Swagger.ts                                                        |       0 |      100 |       0 |       0 | 2-29
  constants.ts                                                      |       0 |      100 |     100 |       0 | 1-5
 src/modules/crop                                                   |       0 |      100 |     100 |       0 |
  crop.module.ts                                                    |       0 |      100 |     100 |       0 | 1-17
 src/modules/crop/controller                                        |   93.75 |        0 |     100 |   92.85 |
  Crop.controller.ts                                                |   93.75 |        0 |     100 |   92.85 | 31
 src/modules/crop/entity                                            |    65.9 |      100 |       0 |   75.75 |
  Crop.ts                                                           |   65.21 |      100 |       0 |   81.25 | 15,35,45
  CropsPlanted.ts                                                   |   66.66 |      100 |       0 |   70.58 | 14,23,31,40,43
 src/modules/crop/error                                             |   66.66 |      100 |   66.66 |   66.66 |
  CreateCropsPlantedError.ts                                        |     100 |      100 |     100 |     100 |
  CropNotExistsError.ts                                             |       0 |      100 |       0 |       0 | 1-12
  SomeCropNotExistsError.ts                                         |     100 |      100 |     100 |     100 |
 src/modules/crop/provider/get-crops/implementation                 |    62.5 |      100 |       0 |      50 |
  GetCropsProviders.ts                                              |    62.5 |      100 |       0 |      50 | 9-16
 src/modules/crop/provider/validate-crops/implementation            |      80 |      100 |       0 |   66.66 |
  ValidateCropsProvider.ts                                          |      80 |      100 |       0 |   66.66 | 12
 src/modules/crop/repository/implementation                         |     100 |      100 |     100 |     100 |
  CropRepository.ts                                                 |     100 |      100 |     100 |     100 |
  CropsPlantedRepository.ts                                         |     100 |      100 |     100 |     100 |
 src/modules/crop/use-case/implementation                           |     100 |      100 |     100 |     100 |
  ListAllCropsUseCase.ts                                            |     100 |      100 |     100 |     100 |
 src/modules/harvest                                                |       0 |      100 |     100 |       0 |
  harvest.module.ts                                                 |       0 |      100 |     100 |       0 | 1-13
 src/modules/harvest/controller                                     |   93.75 |        0 |     100 |   92.85 |
  Harvest.controller.ts                                             |   93.75 |        0 |     100 |   92.85 | 31
 src/modules/harvest/entity                                         |    82.6 |      100 |      20 |   81.25 |
  Harvest.ts                                                        |    82.6 |      100 |      20 |   81.25 | 15,35,45
 src/modules/harvest/error                                          |     100 |      100 |     100 |     100 |
  HarvestNotExistsError.ts                                          |     100 |      100 |     100 |     100 |
 src/modules/harvest/repository/implementation                      |     100 |      100 |     100 |     100 |
  HarvestRepository.ts                                              |     100 |      100 |     100 |     100 |
 src/modules/harvest/use-case/implementation                        |     100 |      100 |     100 |     100 |
  ListAllHarvestUseCase.ts                                          |     100 |      100 |     100 |     100 |
 src/modules/producer                                               |       0 |      100 |     100 |       0 |
  producer.module.ts                                                |       0 |      100 |     100 |       0 | 1-35
 src/modules/producer/controller                                    |   92.45 |        0 |     100 |   92.15 |
  Producer.controller.ts                                            |   92.45 |        0 |     100 |   92.15 | 79,128,194,221
 src/modules/producer/dto                                           |     100 |      100 |     100 |     100 |
  CreateProducerDTO.ts                                              |     100 |      100 |     100 |     100 |
  UpdateProducerDTO.ts                                              |     100 |      100 |     100 |     100 |
 src/modules/producer/entity                                        |   76.92 |      100 |   14.28 |   73.68 |
  Producer.ts                                                       |   76.92 |      100 |   14.28 |   73.68 | 16,24,39,47,56
 src/modules/producer/error                                         |     100 |      100 |     100 |     100 |
  CpfOrCnpjExistsError.ts                                           |     100 |      100 |     100 |     100 |
  CreateProducerError.ts                                            |     100 |      100 |     100 |     100 |
  ProducerNotExistsError.ts                                         |     100 |      100 |     100 |     100 |
 src/modules/producer/repository/implementation                     |     100 |      100 |     100 |     100 |
  ProducerRepository.ts                                             |     100 |      100 |     100 |     100 |
 src/modules/producer/use-case/implementation                       |     100 |      100 |     100 |     100 |
  CreateProducerUseCase.ts                                          |     100 |      100 |     100 |     100 |
  DeleteProducerUseCase.ts                                          |     100 |      100 |     100 |     100 |
  ListAllProducersUseCase.ts                                        |     100 |      100 |     100 |     100 |
  UpdateProducerUseCase.ts                                          |     100 |      100 |     100 |     100 |
 src/modules/rural_propertie                                        |       0 |      100 |     100 |       0 |
  rural_propertie.module.ts                                         |       0 |      100 |     100 |       0 | 1-15
 src/modules/rural_propertie/controller                             |   93.75 |        0 |     100 |   92.85 |
  RuralPropertie.controller.ts                                      |   93.75 |        0 |     100 |   92.85 | 33
 src/modules/rural_propertie/dto                                    |   83.33 |      100 |       0 |   83.33 |
  DashboardDataDTO.ts                                               |   83.33 |      100 |       0 |   83.33 | 26,29
 src/modules/rural_propertie/entity                                 |   77.77 |      100 |   11.11 |   73.33 |
  RuralPropertie.ts                                                 |   77.77 |      100 |   11.11 |   73.33 | 19,26,57,64,74,77,81-82
 src/modules/rural_propertie/error                                  |     100 |      100 |     100 |     100 |
  CreateRuralPropertieError.ts                                      |     100 |      100 |     100 |     100 |
  RuralPropertieNotExistsError.ts                                   |     100 |      100 |     100 |     100 |
  ValidateAreasError.ts                                             |     100 |      100 |     100 |     100 |
 src/modules/rural_propertie/provider/validate-areas/implementation |      80 |      100 |       0 |   66.66 |
  ValidateAreasProvider.ts                                          |      80 |      100 |       0 |   66.66 | 12
 src/modules/rural_propertie/repository/implementation              |     100 |      100 |     100 |     100 |
  RuralPropertieRepository.ts                                       |     100 |      100 |     100 |     100 |
 src/modules/rural_propertie/use-case/implementation                |     100 |      100 |     100 |     100 |
  GetDataDashboardUseCase.ts                                        |     100 |      100 |     100 |     100 |
 src/shared/messages                                                |     100 |      100 |     100 |     100 |
  error.ts                                                          |     100 |      100 |     100 |     100 |
  flow.ts                                                           |     100 |      100 |     100 |     100 |
 src/shared/types                                                   |    87.8 |     90.9 |   81.81 |   89.74 |
  ApplicationError.ts                                               |   55.55 |      100 |      20 |   55.55 | 17-29
  Left.ts                                                           |     100 |      100 |     100 |     100 |
  Optional.ts                                                       |   95.45 |     90.9 |     100 |     100 | 47
  Right.ts                                                          |     100 |      100 |     100 |     100 |
 src/shared/utils                                                   |     100 |      100 |     100 |     100 |
  buildError.ts                                                     |     100 |      100 |     100 |     100 |
  buildSuccess.ts                                                   |     100 |      100 |     100 |     100 |
--------------------------------------------------------------------|---------|----------|---------|---------|-------------------------

Test Suites: 16 passed, 16 total
Tests:       67 passed, 67 total
Snapshots:   0 total
Time:        14.433 s
Ran all test suites.
```

## Observação

Caso queira parar a execução do projeto, digite o seguinte comando em seu terminal:
```bash
docker-compose down
```

Que caso tudo dê certo, será lhe mostrado uma saída semelhante a essa:
```bash
Stopping verx-challenge-api      ... done
Stopping database-verx-challenge ... done
Removing verx-challenge-api      ... done
Removing database-verx-challenge ... done
Removing network verx-challenge_verx-challenge
```
E o Docker terá desligado seus containers e consequentemente parado a execução do projeto.

## CASO QUEIRA SABER MAIS SOBRE O PROJETO

Pode entrar em contato comigo pelo seguinte email: ericdesenvolvedor7@gmail.com
