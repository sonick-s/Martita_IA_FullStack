import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Creada por',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Martita_IA Fue Creada en el proyecto de tesis de Jean de la Cruz y Omar Sani 2025 
      </>
    ),
  },
  {
    title: 'Martita_IA ',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Martita_IA Te permite gestionar Informacion de tramies que serviran como Guia; para los ciudadanos.
      </>
    ),
  },
  {
    title: 'Fue Creada con Las Siguientes tecnologias',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Vue.js, Node.js 22.12.0, Python 3.12.0,Fast Api, Faiss , Mysql, Flowise, Docker, Api de Gemini, Esfuerzo y Lagrimas :).
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
