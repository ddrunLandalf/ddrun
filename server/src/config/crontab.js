module.exports = [
    {
        cron: '0 0-7/2 * * *',
        handle: 'cron/anlysis/order',
        type: 'all'
    },
    {
        cron: '0 0-7/2 * * *',
        handle: 'cron/anlysis/wxuser',
        type: 'all'
    }
]