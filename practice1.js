const companies = [
    {name: 'Intelliswift', hq:'NewYork,CA', indiaLocations: ['Pune','Bangalore']},
    {name: 'Salesforce', hq: 'San Francisco, CA', indiaLocations: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Gurugram', 'Jaipur']}
]

function showInfo(){
    let output = '';
    const companyInfoDiv = document.getElementById('companyInformation');
    companies.forEach(company => {
        output += '<li>' + company.name + ' - ' + company.hq + ' - ' + company.indiaLocations.join(', ') + '</li>';
        console.log('output', output);
    });
       
    companyInfoDiv.innerHTML = output;
}