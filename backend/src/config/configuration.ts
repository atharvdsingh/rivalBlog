 export default ()=>({
    port:parseInt(process.env.PORT!),
    database_url:process.env.DATABASE_URL,
    saultRound: parseInt( process.env.salt_rounde!) || 20
 })