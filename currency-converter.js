const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get('http://www.apilayer.net/api/live?access_key=2dbcd6fb2fe6ac7676754679e0ee1395');

        const rate = response.data.quotes;
        const baseCurrency = response.data.source;
        const usd = 1 / rate[`${baseCurrency}${fromCurrency}`];
        const exchangeRate = usd * rate[`${baseCurrency}${toCurrency}`];

        return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }
};

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);

        return response.data.map(country => country.name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency, toCurrency),
        getCountries(toCurrency),
    ]);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

convertCurrency('BTC', 'USD', 1)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
    console.log(error.message);
});