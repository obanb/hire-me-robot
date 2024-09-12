
import {pinecone} from "./vector-connector";
import {Document} from "@langchain/core/documents";


import * as dotenv from 'dotenv';
import {PineconeStore} from "@langchain/pinecone";
import {OpenAIEmbeddings} from "@langchain/openai";
dotenv.config({ path: '.env.local' });

const __PINECONE_IDX__ = 'hireme-idx'
const __DIMENSIONS__ = 1536
const __PINECONE_CLOUD__ = 'aws'
const __PINECONE_REGION__ = 'us-east-1'
const __EMBEDDINGS__ = 'text-embedding-3-small'

const seed = async () => {
    try {
        const indexes = await pinecone.listIndexes();
        const existingIndex = indexes.indexes?.map((index) => index.name).includes(__PINECONE_IDX__);
        if(!existingIndex) {
            console.log(`creating pinecone idx ${__PINECONE_IDX__}..`)
            await pinecone.createIndex({
                name: __PINECONE_IDX__,
                dimension: __DIMENSIONS__,
                //  cosine because context and relative importance of features are more critical than their absolute values
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: __PINECONE_CLOUD__,
                        region: __PINECONE_REGION__
                    }
                }
            })
        }

        const embeddings = new OpenAIEmbeddings({
            model: __EMBEDDINGS__
        })

        const docs: Document[] = mockSeed.map((sourceDoc) => ({
            metadata: sourceDoc.metadata,
            pageContent: `[${sourceDoc.metadata.segment}]- ${(sourceDoc.data)}`
        }));


        const pineconeIndex = pinecone.Index(__PINECONE_IDX__);

        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex,
            maxConcurrency: 1,
        });

    }catch (error:any) {
        console.error('Failed to seed vector database:', error.stack)
    }
}



const mockSeed  = [{
    "metadata":{
        "agent":"Simona",
        "segment": "informace o společnosti",
    },
    "data":"Naší hlavní předností je odbornost a dlouholetá praxe v různých segmentech. Ať už se jedná například o energetiku, bankovnictví či e-commerce. ApiTree disponuje seniory nejen v oblasti vývoje či analýzy. Máme dlouholeté zkušenosti s cloudovým vývojem na platformě Kubernetes."
},
    {
        "metadata":{
            "agent":"Simona",
            "segment": "informace o společnosti",
        },
        "data":" Telefon: +420 602 609 112 E-mail: info@apitree.cz ApiTree s.r.o Francouzská 75/4 Praha 2 Vinohrady 12000 IČ: 06308643 DIČ: CZ06308643"
    },
    {
        "metadata":{
            "agent":"Simona",
            "segment": "informace o společnosti",
        },
        "data":" Společnost ApiTree s.r.o. jsme založili v červenci 2017. Zakladatelem a hlavním jednatelem společnosti je Aleš Dostál. V ApiTree s.r.o. se primárně soustředíme na zakázkový vývoj aplikací a konzultační činnost. Kromě toho také prezentujeme naše know-how prostřednictvím přednášek jako například JavaScript vládne všem.\n" +
            "\n" +
            "Mezi naše hlavní úspěchy patří kompletní vývoj distribučního portálu pro společnost E.ON Česká republika, s.r.o. Součástí dodávky, která je kompletně v Cloudu (Azure), je také API pro distribuci vytvořené v GraphQL, přičemž s tímto API komunikují webové či mobilní aplikace. Našimi dalšími projekty jsou například tvorba tréninkového simulátoru pro karetní hru poker nebo spolupráce se společností Oriflame, pro kterou tvoříme novou frontend platformu, která splňuje podmínky jako microservices či spolupráce s několika týmy v řádech desítek vývojářů.\n" +
            "\n" +
            "Naší předností je samostatnost, cit pro detail, hluboká technologická znalost a mnohaleté zkušenosti z oblastí robustních systémů v bankovnictví, pojišťovnictví, energetice či telcu."
    },
    {
        "metadata":{
            "agent":"Simona",
            "segment": "informace o společnosti",
        },
        "data":"Neomezený homeoffice, ale rádi tě v kanceláři alespon občas uvidíme."
    },
    {
        "metadata":{
            "agent":"Simona",
            "segment": "informace o společnosti, projekty",
        },
        "data":"Oriflame - Na přelomu roku 2019 jsme začali spolupracovat na návrhu a implementaci nového frontendového řešení pro společnost Oriflame. Cílem naší práce je tvorba microfrontend architektury s využitím technologií jako je React, Node.js a Kubernetes. E.ON Distribuční portál - Distribuční portál\n" +
            "Kompletní tvorba nového distribučního portálu pro společnost E.ON Česká republika. Primárně má sloužit pro obsluhu obchodníků a denně přes něj protečou stovky žádostí různých typů. Součástí několikaletého vývoje je i OpenAPI, které poskytuje data mobilním či webovým aplikacím. TYR - iž několik let vyvíjíme vlastní systém na řízení společnosti. Motivací bylo, abychom měli pouze jeden komplexní systém na správu objednávek, fakturací, příležitostí, projektů, podporu pro HR, integraci s bankou, apod. V budoucnu plánujeme celý systém převést do formy produktu. OREA Hotels -  integrační platforma."
    },
    {
        "metadata": {
            "agent": "Aleš",
            "segment": "informace o společnosti, technologie",
        },
        "data": "V ApiTree se soustředíme na to, abychom s použitím správných technologií splnili a dokončili, co od nás naši klienti očekávají. Velký důraz je přitom kladen zejména na využití technologií, které jsou celosvětově vnímány jako ta nejlepší a nejvhodnější volba. Node.JS, GraphQL, Azure, Kubernetes, Java, React, Next.js, Helm, Docker, Kibana, ElasticSearch, Kafka, Redis.."
    }
]

seed()