const fs = require('fs');
const axios = require('axios');

async function generateLiveJson() {

    // const appReviewJson = await axios.get('https://api.assistantapps.com/AppReview/1');
    // console.log('appReviewJson');

    const teamMembersJson = await axios.get('https://api.assistantapps.com/TeamMember');
    console.log('teamMembersJson');

    const donationJson = await axios.get('https://api.assistantapps.com/Donation?page=1');
    console.log('donationPageJson 1');
    let donationList = [...donationJson.data.value];
    for (let donationIndex = 1; donationIndex < donationJson.data.totalPages; donationIndex++) {
        const pageToRequest = donationIndex + 1;
        const donationPageJson = await axios.get(`https://api.assistantapps.com/Donation?page=${pageToRequest}`);
        console.log('donationPageJson ' + pageToRequest);
        donationList = [...donationList, ...(donationPageJson?.data?.value ?? [])];
    }

    let fullJson = {
        teamMembers: teamMembersJson.data,
        donations: donationList.filter(d => d.type != 'Patreon'),
    };

    fs.writeFile('./webpack/data/live.json', JSON.stringify(fullJson), ['utf8'], () => { });
}

generateLiveJson();