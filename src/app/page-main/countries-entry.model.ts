import {CoviddataModel} from './section/coviddata.model';

export interface CountriesEntryModel extends CoviddataModel {
  Country: string;
  Slug: string;
}
