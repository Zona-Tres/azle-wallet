export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'getAddress' : IDL.Func([], [IDL.Text], []) });
};
export const init = ({ IDL }) => { return []; };
