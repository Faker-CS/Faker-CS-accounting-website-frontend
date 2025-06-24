// eslint-disable-next-line import/no-unresolved
import { _id } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',

  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/home`,
      five: `${ROOTS.DASHBOARD}/home/five`,
      six: `${ROOTS.DASHBOARD}/home/six`,
    },
    companyMenu: {
      root: `${ROOTS.DASHBOARD}/document demands`,
      deposit: `${ROOTS.DASHBOARD}/document demands/deposit`,
      newDemande: `${ROOTS.DASHBOARD}/document demands/newDemande`,
      declarationImpotDrop: (id) => `${ROOTS.DASHBOARD}/document demands/depot/${id}`,
      sarl: `${ROOTS.DASHBOARD}/document demands/sarl`,
      suarl: `${ROOTS.DASHBOARD}/document demands/suarl`,
      sarls: `${ROOTS.DASHBOARD}/document demands/sarl-s`,
      snc: `${ROOTS.DASHBOARD}/document demands/snc`,
      sa: `${ROOTS.DASHBOARD}/document demands/sa`,
    },
    files: {
      root: `${ROOTS.DASHBOARD}/files`,
      company: (id) => `${ROOTS.DASHBOARD}/files/company/${id}`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      newEntreprise: `${ROOTS.DASHBOARD}/users/new entreprise`,
      editEntreprise: (id) => `${ROOTS.DASHBOARD}/users/${id}/edit`,
      effectifs: `${ROOTS.DASHBOARD}/users/effectifs`,
      createEntreprise: `${ROOTS.DASHBOARD}/users/create`,
      aideComptable: `${ROOTS.DASHBOARD}/users/aide-comptable`,
      newAideComptable: `${ROOTS.DASHBOARD}/users/aide-comptable/new`,
    },
    banking: {
      root: `${ROOTS.DASHBOARD}/banking`,
      accounts: `${ROOTS.DASHBOARD}/banking/accounts`,
      transactions: `${ROOTS.DASHBOARD}/banking/transactions`,
      analytics: `${ROOTS.DASHBOARD}/banking/analytics`,
    },
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    profile: `${ROOTS.DASHBOARD}/profile`,
    demandes: `${ROOTS.DASHBOARD}/demandes`,
    viewForm: (id) => `${ROOTS.DASHBOARD}/demandes/${id}/demands`,
  },
};
