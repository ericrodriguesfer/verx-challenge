export enum CropControllerMessages {
  ROUTE_LIST_ALL_CROPS_CALLED = '[GET - crop/] Route list all crops called.',
}

export enum HarvestControllerMessages {
  ROUTE_LIST_ALL_HARVESTS_CALLED = '[GET -harvest/] Route list all harvests called',
}

export enum ProducerControllerMessages {
  ROUTE_LIST_ALL_PRODUCERS_CALLED = '[GET - producer/] Route list all producers called',
  ROUTE_CREATE_PRODUCER_CALLED = '[POST - producer/] Route to create producer called',
  ROUTE_UPDATE_PRODUCER_CALLED = '[PUT - producer/] Route to update producer called',
  ROUTE_DELETE_PRODUCER_CALLED = '[DELETE - producer/] Route to delete producer called',
}

export enum RuralPropertieControllerMessages {
  ROUTE_GET_DATA_DASHBOARD_CALLED = '[GET - rural-propertie/dashboard] Route to return data for dashboard called',
}
