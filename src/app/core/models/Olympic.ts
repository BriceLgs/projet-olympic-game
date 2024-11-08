// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

import { OlympicParticipation } from "./Participation";

export class OlympicModels {
    id!: number;
    country!: string;
    participations!: OlympicParticipation[];
}
