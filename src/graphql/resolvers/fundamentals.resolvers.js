export default {
  Query: {
    lookupFundamental: async (root, { identifier, statementCode, fiscalYear, fiscalPeriod }, { fundamentals }) => {
      try {
        const data = await fundamentals.lookupFundamental(identifier, statementCode, fiscalYear, fiscalPeriod);
        return data;
      } catch (e) {
        console.log(e);
      }
    },
    getFundamentalStandardizedFinancials: async (root, { id }, { fundamentals }) => {
      try {
        const data = await fundamentals.getFundamentalStandardizedFinancials(id);
        return data;
      } catch (e) {
        console.log(e);
      }
    }
  }
}