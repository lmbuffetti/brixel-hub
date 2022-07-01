import LogoBaloise from '../../images/Companies/Baloise/BaloiseLogo.svg';
import LogoUBS from '../../images/Companies/ubsKey4/ubsLogo.svg';
import LogoKey4 from '../../images/Companies/ubsKey4/key4Logo.svg';

export const CompaniesData = {
  baloise: {
    footer: {
      leftLink: [
        {
          label: 'AGBs',
          link: '',
        }, {
          label: 'Datenschutz',
          link: '',
        }
      ],
      logos: [LogoBaloise],
    },
  },
  ubs_key4: {
    footer: {
      leftLink: [
        {
          label: 'AGBs',
          link: '',
        }, {
          label: 'Datenschutz',
          link: '',
        }
      ],
      logos: [LogoUBS, LogoKey4],
    },
  },
  default: {
    footer: {
      leftLink: [],
      logos: [],
    }
  }
}
