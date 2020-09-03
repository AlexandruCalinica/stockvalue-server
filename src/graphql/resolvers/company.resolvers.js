import fs from "fs";

export default {
  Query: {
    getCompanyTagNumber: async (root, { identifier, tag }, { company }) => {
      try {
        const value = await company.getCompanyDataPointNumber(identifier, tag);
        return {
          identifier,
          tag,
          value,
        };
      } catch (e) {
        return {
          identifier,
          tag,
          value: null,
          error: {
            clientError: e.response.clientError,
            serverError: e.response.serverError,
            errorCode: e.response.error.status,
            redirect: e.response.redirect,
            text: e.response.error.text,
            method: e.response.error.method,
            path: e.response.error.path,
            hint: `maybe identifier: '${identifier}' does not have a valid tag value '${tag}' on the backend. If other identifiers return 200 you might be in sandbox environment or you don't have access to this resource.`,
          },
        };
      }
    },
    getCompanyTagText: async (root, { identifier, tag }, { company }) => {
      try {
        const value = await company.getCompanyDataPointText(identifier, tag);
        return {
          identifier,
          tag,
          value,
        };
      } catch (e) {
        return {
          identifier,
          tag,
          value: null,
          error: {
            clientError: e.response.clientError,
            serverError: e.response.serverError,
            errorCode: e.response.error.status,
            redirect: e.response.redirect,
            text: e.response.error.text,
            method: e.response.error.method,
            path: e.response.error.path,
            hint: `maybe identifier: '${identifier}' does not have a valid tag value '${tag}' on the backend. If other identifiers return 200 you might be in sandbox environment or you don't have access to this resource.`,
          },
        };
      }
    },
    getCompanyHistoricalData: async (
      root,
      { identifier, tag, ...rest },
      { company }
    ) => {
      try {
        const values = await company.getCompanyHistoricalData(identifier, tag, {
          ...rest,
          startDate: rest.startDate ? new Date(rest.startDate) : null,
        });
        console.log(values.historical_data);
        // fs.writeFile("eps.json", JSON.stringify(values.historical_data), "utf8", () => console.log("write successful!"));
        return values;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
