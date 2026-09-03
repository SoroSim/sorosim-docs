import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Browser-Based Sandbox',
    description: (
      <>
        Upload WASM contracts, configure mock ledger state, and simulate
        invocations directly in your browser. No testnet required.
      </>
    ),
  },
  {
    title: 'Visual State Inspector',
    description: (
      <>
        See exactly how your contract changes ledger state. Inspect before/after
        diffs, footprint analysis, and ScVal transformations.
      </>
    ),
  },
  {
    title: 'CLI for CI/CD',
    description: (
      <>
        Integrate contract testing into your CI pipeline with the SoroSim CLI.
        Automate dry-runs and catch issues before deployment.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
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
