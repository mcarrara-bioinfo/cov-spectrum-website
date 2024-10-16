import React, { useEffect } from 'react';
import { ExternalLink } from '../../../components/ExternalLink';
import { WasteWaterSamplingSites } from './WasteWaterSamplingSites';

export const WasteWaterStoryPage = () => {
  useEffect(() => {
    document.title = `Wastewater in Switzerland - Stories - covSPECTRUM`;
  });

  return (
    <div className='px-4 md:px-8'>
      <h1>Wastewater in Switzerland</h1>
      <div className='italic'>
        by{' '}
        <ExternalLink url='https://bsse.ethz.ch/cbg/'>Computational Biology Group, ETH Zurich</ExternalLink>
      </div>
      <p>
        We analyze wastewater samples collected at different Swiss wastewater treatment plants ( see data
        sources below) using next-generation sequencing (done by{' '}
        <ExternalLink url='https://fgcz.ch/'>FGCZ</ExternalLink>), process the resulting short-read data with{' '}
        <ExternalLink url='https://cbg-ethz.github.io/V-pipe/'>V-pipe</ExternalLink>, and search for mutations
        characteristic of several variants of concern. The relative frequency of each signature mutation is
        determined, and all frequencies are combined per day, which provides an estimate of the relative
        prevalence of the variant in the population. Some variants have specific signature mutations that
        co-occur on the same fragment. Amplicons with such co-occurrences are included in the heatmaps of the
        wastewater data displayed on covSpectrum (see{' '}
        <ExternalLink url='https://doi.org/10.1101/2021.01.08.21249379'>
          doi:10.1101/2021.01.08.21249379
        </ExternalLink>{' '}
        and <ExternalLink url='https://github.com/cbg-ethz/cowwid'>cowwid</ExternalLink> for more details).
      </p>
      <p>
        Detecting variants in wastewater is challenging if the RNA concentration is low, for example, due to
        low infection numbers in the catchment area of the wastewater treatment plant. Estimates of the
        proportions of variants are less reliable in this situation.
      </p>
      <WasteWaterSamplingSites />
      <DataSources />
      <VideoPresentation />
      <Acknowledgements />
      <Funding />
      <Contact />
    </div>
  );
};

const DataSources = () => {
  return (
    <div>
      <h2>Data sources</h2>
      <p>
        <ExternalLink url={'https://www.eawag.ch/en/department/sww/projects/sars-cov2-in-wastewater/'}>
          Eawag
        </ExternalLink>{' '}
        collects samples daily at six Swiss wastewater treatment plants: Altenrhein (SG), Chur (GR), Genève
        (GE), Laupen (BE), Lugano (TI). For the City of Zurich, samples are collected from the Werdhölzli
        plant (catchment area covers the city center). Since 2023 the project has been joined by Microsynth,
        sampling in Lausanne (Vidy), Sierre/Noes (VS) and Porrentruy (JU). The Health Department of
        Basel-Stadt provides samples from the ProRheno AG wastewater treatment plant three times per week
        (once per week until the end of 2022).
      </p>
      <p>Previous monitoring that was discontinued: Lausanne (VD), Kanton Zürich</p>
      <p>
        Until end of May 2022 three times a week the Cantonal Laboratory Zurich (KLZH) provided samples that
        assess the Canton of Zurich by pooling samples from 12 plants across the canton, namely
        Zürich-Werdhölzli (also used by Eawag), Winterthur-Hard, Dietikon-Limmattal, Dübendorf-Neugut,
        Niederglatt-Fischbach, Uster, Bülach-Furt, Wetzikon-Flos, Horgen-Oberrieden, Meilen, Affoltern
        a.A.-Zwillikon, and Illnau-Mannenberg.
      </p>
    </div>
  );
};

const VideoPresentation = () => {
  return (
    <div>
      <h2>Video presentation of the surveillance project</h2>
      <p>
        During the webinar{' '}
        <ExternalLink url={'https://iwa-network.org/learn/detecting-covid-19-variants-in-wastewater/'}>
          "Detecting COVID-19 Variants in Wastewater" by the International Water Association (IWA)
        </ExternalLink>
        , Prof. Tamar Kohn and Prof. Niko Beerenwinkel have presented this surveillance project. The
        presentation is the second session of this webinar,
        <ExternalLink url={'https://vimeo.com/560055953#t=1337s'}>
          "Detection and surveillance of SARS-CoV-2 genomic variants in Swiss wastewater" (timecode 22:17).
        </ExternalLink>
        .
      </p>
    </div>
  );
};

const Acknowledgements = () => {
  return (
    <div>
      <h2>Acknowledgements</h2>
      <h3>
        <ExternalLink url={'https://bsse.ethz.ch/cbg'}>
          Computational Biology Group (CBG), ETH Zürich{' '}
        </ExternalLink>{' '}
        /{' '}
        <ExternalLink url={'https://www.sib.swiss/niko-beerenwinkel-group'}>
          Swiss Institute of Bioinformatics
        </ExternalLink>
      </h3>
      <Authors
        authors={
          'Katharina Jahn, Pelin Burcak Icer, David Dreifuss, Ivan Topolsky, Lara Fuhrmann, Kim Philipp Jablonski, Anika John, Niko Beerenwinkel'
        }
      />
      <h3>
        <ExternalLink url={'https://bsse.ethz.ch/cevo'}>
          Computational Evolution (cEvo), ETH Zürich
        </ExternalLink>{' '}
        /{' '}
        <ExternalLink url={'https://www.sib.swiss/tanja-stadler-group'}>
          Swiss Institute of Bioinformatics
        </ExternalLink>
      </h3>
      <Authors authors={'Chaoran Chen, Sarah Nadeau, Tanja Stadler'} />
      <h3>
        <ExternalLink url={'https://www.nexus.ethz.ch/'}>
          NEXUS Personalized Health Technologies, ETH Zürich
        </ExternalLink>{' '}
        /{' '}
        <ExternalLink url={'https://www.sib.swiss/daniel-stekhoven-group'}>
          Swiss Institute of Bioinformatics
        </ExternalLink>
      </h3>
      <Authors authors={'Matteo Carrara, Franziska Singer'} />
      <h3>Eawag</h3>
      <Authors
        authors={
          'Anina Kull, Pravin Ganesanandamoorthy, Carola Bänziger, Alexander J. Devaux, Elyse Stachler, Lea Caduff, Christoph Ort, Timothy R. Julian'
        }
      />
      <h3>Functional Genomic Center Zürich</h3>
      <Authors authors={'Catharine Aquino, Lennart Opitz, Tim Sykes'} />
      <h3>Genomic Facility Basel</h3>
      <Authors authors={'Mirjam Feldkamp, Christian Beisel'} />
      <h3>Laboratory of Environmental Chemistry EPFL</h3>
      <Authors authors={'Xavier Fernandez-Cassi, Federica Cariti, Alex Tuñas Corzón, Tamar Kohn'} />
      <h3>Microsynth AG</h3>
      <Authors authors={'Cristoph Gruenih, Maria-Luise Deflorian'} />
    </div>
  );
};

const Authors = ({ authors }: { authors: string }) => {
  return <p className={'italic'}>{authors}</p>;
};

const Funding = () => {
  return (
    <div>
      <h2>Funding</h2>
      <p>Federal Office for Public Health</p>
    </div>
  );
};

const Contact = () => {
  return (
    <div>
      <h2>Contact</h2>
      <ExternalLink url={'https://bsse.ethz.ch/cbg'}>Computational Biology, D-BSSE, ETHZ.</ExternalLink> Niko
      Beerenwinkel,
    </div>
  );
};
