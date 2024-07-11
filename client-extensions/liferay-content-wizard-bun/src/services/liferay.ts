import ky from 'ky';

export default function getLiferayInstance() {
  return ky.extend({
    prefixUrl: 'http://localhost:8080',
    headers: {
      Authorization: 'Basic dGVzdEBsaWZlcmF5LmNvbTox',
    },
    hooks: {
      beforeError: [
        async (error) => {
          const response = error.response;

          console.log(error.message);
          console.log({ error });

          if (response) {
            const data = await response.json();
            console.log(
              `Error Formatted: ${JSON.stringify(data, null, 2)} (${
                response.status
              })`
            );
          }

          return error;
        },
      ],
    },
    retry: {
      limit: 2,
      methods: ['get', 'post'],
      statusCodes: [400, 403, 401],
      backoffLimit: 3000,
    },
  });
}

export type LiferayInstance = ReturnType<typeof getLiferayInstance>;
