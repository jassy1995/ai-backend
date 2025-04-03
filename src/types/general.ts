export type TDbConfig = {
    HOST: string;
    USER: string;
    PASSWORD: string;
    DB: string;
    dialect: string | any;
    pool: {
        max: number;
        min: number;
        connectionLimit: number;
        acquire: number;
        idle: number;
    };
    dialectOptions: {
        decimalNumbers: boolean;
        maxPreparedStatements: number;
    };
}
export type TRequest = {
    request_id: string,
    agent_phone: string,
    merchant_phone: string,
    disbursement_date: string,
    request_principal: string,
    home_address: string,
    image: string,
    is_onboarded_by_agent: boolean,
    total_left: string,
}
export type TAgent = {
    first_name: string;
    last_name: string;
    phone: string;
    region: string
}
export type TRegion = {
    name: string;
    regional_header?: string;
}
export type TTransaction = {
    request_id?: string;
    product: string;
    transaction_status: string;
    agent_phone: string;
    merchant_name: string;
    merchant_phone: string;
    loan_amount: string;
    business_name: string;
}
export type TUpdateTransactionStatus = {
    transaction_id: number;
    request_id: string;
    transaction_status: string;
}
