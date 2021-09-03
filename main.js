console.clear();

const chalk = require(`chalk`);
const moment = require(`moment`);

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`What's your tixte account token?\n`, token => {
    console.clear();
    console.log(chalk.red(`If you see this and there is an error with the status code "401" below this text, your token may not be valid!`))
    if (token.length === 0) return console.log(chalk.red(`Invalid auth! No token given.`));
    if (!token.startsWith(`tx.mfa.`)) return console.log(chalk.red(`Invalid auth! No Tixte token given.`));
    if (token.length < 60) return console.log(chalk.red(`Invalid auth! Invalid Tixte token given.`));
    if (token.length > 64) return console.log(chalk.red(`Invalid auth! Invalid Tixte token given.`));
    const axios = require(`axios`);
    axios({
        method: 'get',
        url: `https://api.tixte.com/v1/users/@me`,
        headers: {
            "Authorization": token
        },
    }).then(function (res) {
        axios({
            method: 'get',
            url: `https://api.tixte.com/v1/users/@me/domains`,
            headers: {
                "Authorization": token
            },
        }).then(function (res2) {
            axios({
                method: 'get',
                url: `https://api.tixte.com/v1/users/@me/config`,
                headers: {
                    "Authorization": token
                },
            }).then(function (res3) {
                console.clear();
                let emailVerified = chalk.green("verified");
                if (JSON.stringify(res.data.data.email_verified).includes(false)) emailVerified = chalk.red("not verified");
                let phone = chalk.white(res.data.data.phone);
                if (JSON.stringify(res.data.data.phone).includes(null)) phone = chalk.hex('#A5A5A5')(`unknown`);
                let phonelVerified = chalk.white(`verified`);
                if (JSON.stringify(res.data.data.phone).includes(null)) phonelVerified = chalk.red(`not verified`);
                let mfa = chalk.white(`enabled`);
                if (JSON.stringify(res.data.data.mfa_enabled).includes(false)) mfa = chalk.white(`disabled`);
                let admin = chalk.white("yes");
                if (JSON.stringify(res.data.data.admin).includes(false)) admin = chalk.white("no");
                let staff = chalk.white("yes");
                if (JSON.stringify(res.data.data.staff).includes(false)) staff = chalk.white("no");
                let beta = chalk.white(`yes`);
                if (JSON.stringify(res.data.data.beta).includes(false)) beta = chalk.white(`no`);
                let pro = chalk.white(`yes`);
                if (JSON.stringify(res.data.data.pro).includes(false)) pro = chalk.white(`no`);
                let uploadRegion = chalk.gray(undefined);
                if (JSON.stringify(res.data.data.upload_region).includes("us")) uploadRegion = chalk.white(`United States`);
                if (JSON.stringify(res.data.data.upload_region).includes("de")) uploadRegion = chalk.white(`Germany`);
                if (JSON.stringify(res.data.data.upload_region).includes("as")) uploadRegion = chalk.white(`Singapore`);
                m = moment(res.data.data.last_login);

                let branding = chalk.white(`hidden`);
                if (JSON.stringify(res3.data.data.hide_branding).includes(false)) branding = chalk.white(`shown`);

                let providerName = chalk.white(res3.data.data.embed.provider_name);
                let providerUrl = chalk.white(` [${res3.data.data.embed.provider_url}]`);
                let authorName = chalk.white(res3.data.data.embed.author_name);
                let authorUrl = chalk.white(` [${res3.data.data.embed.author_url}]`);
                let title = chalk.white(res3.data.data.embed.title);
                let description = chalk.white(res3.data.data.embed.description);
                let color = chalk.white(res3.data.data.embed.theme_color);

                console.log(`
                    Name:      ${JSON.stringify(res.data.data.username).replace(/(?:")/g, '')}
                    Email:     ${JSON.stringify(res.data.data.email).replace(/(?:")/g, '')} | ${emailVerified}
                    Phone:     ${phone} | ${phonelVerified}
                ${chalk.hex('#2B3238')("—————————————————————————————————————")}
                Last Login:    ${chalk.white(m.format('MMMM Do YYYY, h:mm:ss a'))}
                    Region:    ${uploadRegion.replace(/(?:")/g, '')}
                    mfa:       ${mfa}
                    Beta:      ${beta}
                    Pro:       ${pro}
                    Admin:     ${admin}
                    Staff:     ${staff}
                ${chalk.hex('#2B3238')("—————————————————————————————————————")}
                    Id:        ${chalk.white(JSON.stringify(res.data.data.id).replace(/(?:")/g, ''))}
                    Avatar:    ${chalk.white(JSON.stringify(res.data.data.avatar).replace(/(?:")/g, ''))}
                ${chalk.hex('#2B3238')("—————————————————————————————————————")}
                    Domains:   ${chalk.white(JSON.stringify(res2.data.data.total).replace(/(?:")/g, ''))}`);

                res2.data.data.domains.forEach(function (d) {
                    console.log(`                    Name:      ${chalk.white(JSON.stringify(d.name).replace(/(?:")/g, ''))} | Uploads: ${chalk.white(JSON.stringify(d.uploads))}`);
                });

                console.log(`
                ${chalk.hex('#2B3238')("—————————————————————————————————————")}
                    branding:   ${branding}
                    embed: 
                    • Provider:   ${providerName}${providerUrl}
                    • Author:     ${authorName}${authorUrl}
                    • Title:      ${title}
                    • Desc:       ${description}
                    • Color:      ${color}
                        `);
            });
        });
    });
    readline.close();
});