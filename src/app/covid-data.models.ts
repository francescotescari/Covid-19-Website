export interface CovidDiffEntry {
  NewConfirmed: number;
  NewRecovered: number;
  NewDeaths: number;
  TotalConfirmed: number;
  TotalRecovered: number;
  TotalDeaths: number;
}

export interface CovidSimpleEntry {
  Confirmed: number;
  Deaths: number;
  Recovered: number;
}

export interface DatedCovidSimpleEntry extends CovidSimpleEntry {
  Date: string;
}

export interface DatedCovidDiffEntry extends CovidDiffEntry {
  Date: string;
}

export interface ApiCountryCovidEntry extends DatedCovidSimpleEntry {
  Country: string;
}


function simpleToDiffEntries(data: CovidSimpleEntry[]): DatedCovidDiffEntry[] {

  function diff(last: DatedCovidSimpleEntry, current: DatedCovidSimpleEntry): DatedCovidSimpleEntry {
    if (last == null) {
      return current;
    }
    return {
      Confirmed: current.Confirmed - last.Confirmed,
      Deaths: current.Deaths - last.Deaths,
      Recovered: current.Recovered - last.Recovered,
      Date: null,
    };
  }

  let lastEntry = null;
  return data.map(entry => {
    const value = entry as DatedCovidSimpleEntry;
    const d = diff(lastEntry, value);
    lastEntry = value;
    return {
      NewConfirmed: d.Confirmed,
      TotalConfirmed: value.Confirmed,
      NewDeaths: d.Deaths,
      TotalDeaths: value.Deaths,
      NewRecovered: d.Recovered,
      TotalRecovered: value.Recovered,
      Date: value.Date
    };
  });

}

export const simpleToDiffMapperDated = (value: DatedCovidSimpleEntry[]) => {
  return simpleToDiffEntries(value);
};

export const simpleToDiffMapper = (value: CovidSimpleEntry[]) => {
  return simpleToDiffEntries(value) as CovidDiffEntry[];
};

export function diffToSimpleEntry(entry: CovidDiffEntry): DatedCovidSimpleEntry {
  const e = entry as DatedCovidDiffEntry;
  return {
    Confirmed: e.TotalConfirmed,
    Deaths: e.TotalDeaths,
    Recovered: e.TotalRecovered,
    Date: e.Date
  };
}

export interface NinjaApiEntry {
  cases: object;
  deaths: object;
  recovered: object;
}

export const ninjaToSimpleMapperDated = (value: NinjaApiEntry) => {
  const keys = [['cases', 'Confirmed'], ['deaths', 'Deaths'], ['recovered', 'Recovered']];
  const tmp = {};
  for (const key of keys) {
    const data = value[key[0]];
    Object.entries(data).forEach(([date, num]) => {
      tmp[date] = tmp[date] || {};
      const entry = tmp[date];
      entry[key[1]] = num;
      entry.Date = new Date(date).getTime();
    });
  }
  return Object.values<DatedCovidSimpleEntry>(tmp).sort(((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()));
};

export const diffToSimpleMapperDated = (value: DatedCovidDiffEntry[]) => {
  let firstVal = value[0];
  firstVal = {
    TotalConfirmed: firstVal.TotalConfirmed - firstVal.NewConfirmed,
    TotalRecovered: firstVal.TotalRecovered - firstVal.NewRecovered,
    TotalDeaths: firstVal.TotalDeaths - firstVal.NewDeaths,
    Date: null,
    NewDeaths: 0,
    NewRecovered: 0,
    NewConfirmed: 0,
  };
  const arr = [firstVal].concat(value);
  return arr.map(diffToSimpleEntry);
};

export const diffToSimpleMapper = (value: CovidDiffEntry[]) => {
  return diffToSimpleMapperDated(value as DatedCovidDiffEntry[]) as CovidSimpleEntry[];
};

export interface CountryDiffEntry extends CovidDiffEntry {
  Country: string;
  Slug: string;
}
