/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { ProducerController } from './Producer.controller';
import { ListAllProducersUseCase } from '../use-case/implementation/ListAllProducersUseCase';
import { CreateProducerUseCase } from '../use-case/implementation/CreateProducerUseCase';
import { DeleteProducerUseCase } from '../use-case/implementation/DeleteProducerUseCase';
import { UpdateProducerUseCase } from '../use-case/implementation/UpdateProducerUseCase';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { UpdateProducerDTO } from '../dto/UpdateProducerDTO';

describe('[E2E] ProducerController', () => {
  let app: INestApplication;
  let listAllProducersUseCase: jest.Mocked<ListAllProducersUseCase>;
  let createProducerUseCase: jest.Mocked<CreateProducerUseCase>;
  let deleteProducerUseCase: jest.Mocked<DeleteProducerUseCase>;
  let updateProducerUseCase: jest.Mocked<UpdateProducerUseCase>;

  const mockProducer = {
    id: '1',
    uuid: '01fdeda8-b964-4b9f-9778-5d9c409a9eb8',
    name: 'name',
    cpfOrCnpj: '12345678901',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ListAllProducersUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(buildSuccess([mockProducer])),
          },
        },
        {
          provide: CreateProducerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(buildSuccess(mockProducer)),
          },
        },
        {
          provide: DeleteProducerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(buildSuccess(true)),
          },
        },
        {
          provide: UpdateProducerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(buildSuccess(mockProducer)),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    listAllProducersUseCase = moduleFixture.get(ListAllProducersUseCase);
    createProducerUseCase = moduleFixture.get(CreateProducerUseCase);
    deleteProducerUseCase = moduleFixture.get(DeleteProducerUseCase);
    updateProducerUseCase = moduleFixture.get(UpdateProducerUseCase);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of producers successfully', async () => {
    const response = await request(app.getHttpServer())
      .get('/producer')
      .expect(200);

    expect(listAllProducersUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual([mockProducer]);
  });

  it('should create a new producer successfully', async () => {
    const createProducerDto = {
      name: 'New Producer',
      cpfOrCnpj: '98765432101',
    };

    const response = await request(app.getHttpServer())
      .post('/producer')
      .send(createProducerDto)
      .expect(201);

    expect(createProducerUseCase.execute).toHaveBeenCalledWith(
      createProducerDto,
    );
    expect(response.body).toEqual(mockProducer);
  });

  it('should update a producer successfully', async () => {
    const updateProducerDto: UpdateProducerDTO = {
      name: 'Updated Producer',
      cpfOrCnpj: '98765432101',
    };

    const response = await request(app.getHttpServer())
      .put('/producer/01fdeda8-b964-4b9f-9778-5d9c409a9eb8')
      .send(updateProducerDto)
      .expect(200);

    expect(updateProducerUseCase.execute).toHaveBeenCalledWith({
      ...updateProducerDto,
      producerUuid: '01fdeda8-b964-4b9f-9778-5d9c409a9eb8',
      ruralPropertieUuid: undefined,
    });
    expect(response.body).toEqual(mockProducer);
  });

  it('should delete a producer successfully', async () => {
    const response = await request(app.getHttpServer())
      .delete('/producer/88842494-c154-4628-b941-5e601ab1b86b')
      .expect(200);

    expect(deleteProducerUseCase.execute).toHaveBeenCalledWith({
      uuid: '88842494-c154-4628-b941-5e601ab1b86b',
    });
    expect(response).toBeDefined();
  });
});
