   // Инициализация Stripe
   const stripe = new Stripe('pk_live_51Q6ZjxIMgp7ryu0xkTG2USrArJyWHcTBIhWAtXyzXuQj3KYaWWF1YLAjx75GdeFBiOqFZCVwQhl7CciY1ungsSfR008UjfDX7I'); // Используйте свой publishable key
   export const initGooglePayClient = () => {
     // Проверка на наличие объекта google
     if (typeof google === 'undefined' || !google.payments || !google.payments.api) {
       console.error("Google Pay API not loaded");
       return;
     }
     return new google.payments.api.PaymentsClient({environment: 'TEST'});
    }
 
   export const onGooglePayButtonClick = (googlePayClient) => {
     const paymentDataRequest = {
       apiVersion: 2,
       apiVersionMinor: 0,
       allowedPaymentMethods: [{
         type: 'CARD',
         parameters: {
           allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
           allowedCardNetworks: ['MASTERCARD', 'VISA']
         },
         tokenizationSpecification: {
           type: 'PAYMENT_GATEWAY',
           parameters: {
            gateway: 'stripe',
            stripe: {
                publishableKey: 'pk_live_51Q6ZjxIMgp7ryu0xkTG2USrArJyWHcTBIhWAtXyzXuQj3KYaWWF1YLAjx75GdeFBiOqFZCVwQhl7CciY1ungsSfR008UjfDX7I',
                version: '2024-09-30.acacia'
             }
           }
         }
       }],
       merchantInfo: {
         merchantName: 'Your Business Name'
       },
       transactionInfo: {
         totalPriceStatus: 'FINAL',
         totalPrice: '10.00',
         currencyCode: 'USD'
       }
     };
     
     googlePayClient.loadPaymentData(paymentDataRequest)
       .then(function(paymentData) {
 
         // Выполняем POST-запрос на сервер
         fetch('http://localhost:3000/create-subscription', {
             method: 'POST', // Указываем метод
             headers: {
                 'Content-Type': 'application/json' // Тип данных, которые отправляем
             },
             body: JSON.stringify(paymentData) // Преобразуем объект данных в JSON
         })
         .then(response => {
             if (!response.ok) {
                 throw new Error('Ошибка запроса');
             }
             return response.json(); // Ожидаем, что ответ будет в формате JSON
         })
         .then(data => {
             console.log('Успешный ответ:', data); // Выводим успешный результат
         })
         .catch(error => {
             console.error('Ошибка при запросе:', error); // Обрабатываем ошибки
         });
         // Отправьте платежные данные на сервер для завершения транзакции
       })
       .catch(function(err) {
         console.error(err);
       });
   }



   