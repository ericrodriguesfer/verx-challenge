export enum ApplicationsErrorMessages {
  INIT_ERROR = 'Error on start application.',
}

export enum CropErrorMessages {
  CROP_NOT_EXISTS = 'Crop does not exists.',
  SOME_CROP_NOT_EXISTS = 'Some crop does not exists.',
  FAILURE_CRATE_CROPS_PLANTED = 'Occured on error in create crops planted.',
}

export enum HarvestErrorMessages {
  HARVEST_NOT_EXISTS = 'Harvest does not exists.',
}

export enum ProducerErrorMessages {
  FAILURE_CRATE_PRODUCER = 'Occured on error in create producer.',
  PRODUCER_NOT_EXISTS = 'Producer does not exists.',
  CPF_CNPJ_EXISTS = 'CPF ou CNPJ document already exists in usage.',
}

export enum RuralPropertieErrorMessages {
  FAILURE_CRATE_PURAL_PROPERTIE = 'Occured on error in create rural propertie.',
  ERROR_VALIDATE_AREAS = 'Planting and vegetation area larger than total area.',
  RURAL_PROPERTIE_NOT_EXISTS = 'Rural propetie does not exstis.',
}
