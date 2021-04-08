import { NextPageContext } from "next";

// Next.js no longer handles errors when integrating with a custom server.
// https://nextjs.org/docs/advanced-features/custom-error-page


const Error = ({ statusCode } : { statusCode : number}) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;