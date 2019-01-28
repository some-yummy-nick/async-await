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

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.`;
};

convertCurrency('EUR', 'RUB', 20)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
    console.log(error.message);
});