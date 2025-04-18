import { IDataService } from "./abstract.service";
import { InstantDataService } from "./instant.service";


export class DataService {

	private static instance: IDataService;

	private constructor() { }

	public static getInstance(): IDataService {

		if (!DataService.instance) {
			switch (process.env.DATA_SERVICE) {
				case 'InstantDB':
					DataService.instance = new InstantDataService();
					break;
				default:
					DataService.instance = new InstantDataService();
			}
		}

		return DataService.instance;
	}

}