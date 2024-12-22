let crytodata = [];
const loader = document.getElementById("loader");
const renderTable = (data) => {
    const table = document.getElementById("dataTable").querySelector("tbody");
    table.innerHTML = "";
    data.forEach(crypto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><div class="d-flex align-items-center"><img src="${crypto.image}" alt="${crypto.name}" width="49"><span>${crypto.name}</span></div></td>
            <td>${crypto.symbol.toUpperCase()}</td>
            <td>$${crypto.current_price.toLocaleString()}</td>
            <td>$${crypto.total_volume.toLocaleString()}</td>
            <td><span class='${crypto.price_change_percentage_24h > 0 ? "text-success" : "text-danger"}'>${crypto.price_change_percentage_24h.toFixed(2)}%</span></td>
            <td>Mkt Cap: $${crypto.market_cap.toLocaleString()}</td>
        `;
        table.appendChild(row);
    });
}
const fetchDataWithThen = (url) => {
    loader.style.display = "";
    fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        crytodata = data;
        renderTable(data);
        loader.style.display = "none";
    })
    .catch(error => console.error('Error fetching data with .then:', error));
}
const fetchDataWithAsync = async (url) => {
    loader.style.display = "";
    try {
        const response = await fetch(url);
        const data = await response.json();
        crytodata = data;
        renderTable(data);
        loader.style.display = "none";
    } catch (error) {
        console.error('Error fetching data with .then:', error);
    }
}
const sortData = (criteria) => {
  const sortedData = [...crytodata];
  if (criteria === "market_cap") {
    sortedData.sort((a, b) => b.market_cap - a.market_cap);
  } else if (criteria === "price_change_percentage") {
    sortedData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  }
  renderTable(sortedData);
}
const searchCrypto = (query) => {
  const filteredData = crytodata.filter(item => 
    item.name.toLowerCase().includes(query) || item.symbol.toLowerCase().includes(query)
  );
  renderTable(filteredData);
}
document.addEventListener('DOMContentLoaded', () => {
    const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    fetchDataWithThen(URL);
    //fetchDataWithAsync(URL);
    const search = document.getElementById("search");
    search.addEventListener('keyup', (event) => {
      const query = event.target.value.toLowerCase();
      searchCrypto(query);
    });
    const button1 = document.getElementById("sortmktcap");
    const button2 = document.getElementById("sortPer");
    button1.addEventListener('click', () => {
      sortData("market_cap");
    });
    button2.addEventListener("click", () => {
      sortData("price_change_percentage");
    })
})