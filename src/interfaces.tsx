export interface Ads {
    id: number;
    name: String;
    quantity: number;
    selected?: boolean;
}

export interface SubCampaign {
    id: number;
    name: String;
    status: boolean;
    ads: Ads[];
    isError?: boolean;
}

export interface dataSubmit {
    information: {
        name: String;
        describe?: String;
    };
    subCampaigns: SubCampaign[];
}