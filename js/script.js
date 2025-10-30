document.addEventListener('DOMContentLoaded', function() {
    const resultado = document.getElementById('resultado');
    const form = document.getElementById('form-cep');
    const cepInput = document.getElementById('cep');

    const apikey = 'f7e29ac2e5b51149a69ef0f7731b987d'; 

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const cep = cepInput.value.replace(/\D/g, ''); 

        if (cep.length !== 8) {
            alert('Por favor, insira um CEP válido com 8 dígitos.');
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) throw new Error('Erro na requisição');
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    resultado.innerHTML = `<p>CEP não encontrado.</p>`;
                    resultado.hidden = false;
                    return;
                }
                resultado.innerHTML = `
                    <h2>Resultado:</h2>
                    <div id="endereco">
                        <h3>Endereço:</h3>
                        <p><strong>CEP:</strong> ${data.cep}</p>
                        <p><strong>Logradouro:</strong> ${data.logradouro}</p>
                        <p><strong>Bairro:</strong> ${data.bairro}</p>
                        <p><strong>Cidade:</strong> ${data.localidade}</p>
                        <p><strong>Estado:</strong> ${data.uf}</p>
                    </div>
                `;

                resultado.hidden = false;

                buscarClima(data.localidade);
            })
            .catch(error => {
                resultado.innerHTML = `<p>Erro ao buscar o CEP: ${error.message}</p>`;
                resultado.hidden = false;
            });

        function buscarClima(cidade) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apikey}&lang=pt_br&units=metric`;

            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao buscar o clima');
                    return response.json();
                })
                .then(data => {
                    const temp = data.main.temp;
                    const desc = data.weather[0].description;
                    const umidade = data.main.humidity;

                    resultado.innerHTML += `
                        <div id="clima">
                            <h3>Clima em ${cidade}:</h3>
                            <p><strong>Temperatura:</strong> ${temp} °C</p>
                            <p><strong>Descrição:</strong> ${desc}</p>
                            <p><strong>Umidade:</strong> ${umidade}%</p>
                        </div>
                    `;
                })
                .catch(error => {
                    resultado.innerHTML += `<p>Erro ao buscar o clima: ${error.message}</p>`;
                });
        }
    });
});
