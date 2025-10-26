import type { ExerciseDetail } from '../types';

export const EXERCISE_LIBRARY: { [group: string]: ExerciseDetail[] } = {
  'Quadríceps': [
    {
      name: 'Agachamento na Máquina Smith',
      description: `Equipamento: Máquina Smith.
1. Ajuste a barra na Máquina Smith a uma altura confortável, geralmente na altura dos ombros.
2. Posicione-se sob a barra com os pés afastados na largura dos ombros, um pouco à frente da linha da barra.
3. Destrave a barra e segure-a firmemente. Mantenha as costas retas e o peito aberto.
4. Agache lentamente, flexionando os joelhos e o quadril, como se estivesse a sentar.
5. Desça até que as suas coxas fiquem paralelas ao chão ou um pouco abaixo, mantendo o controlo.
6. Empurre o chão com os calcanhares para voltar à posição inicial, estendendo as pernas.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2024/10/smith-machine-squat.gif'
    },
    {
      name: 'Leg Press 45',
      description: `Equipamento: Máquina Leg Press.
1. Sente-se no aparelho com as costas e o quadril bem apoiados no encosto.
2. Posicione os pés na plataforma, afastados na largura dos ombros.
3. Empurre a plataforma para destravar o peso e estenda os joelhos, mas sem travá-los completamente.
4. Flexione os joelhos de forma controlada, trazendo a plataforma em direção ao peito até formar um ângulo de aproximadamente 90 graus.
5. Empurre a plataforma de volta à posição inicial, concentrando a força nos calcanhares e quadríceps.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif'
    },
    {
      name: 'Cadeira Extensora',
      description: `Equipamento: Máquina (Cadeira Extensora).
1. Ajuste o assento para que seus joelhos fiquem alinhados com o eixo de rotação da máquina.
2. O rolo de apoio deve ficar posicionado sobre a parte inferior da sua canela, logo acima dos pés.
3. Sente-se com as costas retas e segure-se nos apoios laterais para maior estabilidade.
4. Estenda as pernas de forma controlada, contraindo o quadríceps ao máximo no final do movimento.
5. Retorne à posição inicial lentamente, resistindo ao peso.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif'
    },
     {
      name: 'Afundo / Passada Frontal com Halteres',
      description: `Equipamento: Halteres.
1. Segure um halter em cada mão, ao lado do corpo.
2. Dê um passo à frente com uma perna, mantendo o tronco ereto (movimento de passada).
3. Flexione ambos os joelhos e desça o quadril até que o joelho da perna de trás quase toque o chão. O joelho da frente deve formar um ângulo de 90 graus.
4. Empurre o chão com o pé da frente para dar o próximo passo com a outra perna.
5. Continue alternando as pernas a cada passo.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2022/09/dumbbell-forward-leaning-lunge.gif'
    },
    {
      name: 'Agachamento Livre Profundo',
      description: `Equipamento: Barra.
1. Posicione a barra sobre os ombros (trapézio), não no pescoço.
2. Pés afastados na largura dos ombros, apontando ligeiramente para fora.
3. Mantenha as costas retas, peito aberto e olhe para frente.
4. Inicie o movimento empurrando o quadril para trás e flexionando os joelhos.
5. Desça o máximo possível (abaixo dos 90 graus), mantendo a curvatura lombar neutra.
6. Empurre o chão com força para retornar à posição inicial, contraindo os glúteos no topo.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif'
    },
    {
      name: 'Step-up em Banco com Halteres',
      description: `Equipamento: Halteres, Banco.
1. Segure um halter em cada mão e fique de frente para um banco ou plataforma estável.
2. Coloque um pé inteiro sobre o banco.
3. Impulsione o corpo para cima, usando a força da perna que está no banco, até ficar em pé sobre ele.
4. Evite usar a perna de baixo para dar impulso.
5. Desça de forma controlada com a mesma perna.
6. Complete todas as repetições de um lado antes de trocar.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/12/Dumbeel-Step-Up.gif'
    },
  ],
  'Posteriores': [
    {
        name: 'Stiff (Levantamento Terra Romeno)',
        description: `Equipamento: Barra ou Halteres.
1. Segure a barra ou halteres na frente das coxas, com os pés na largura do quadril.
2. Mantenha os joelhos ligeiramente flexionados (quase esticados, mas não travados).
3. Inicie o movimento empurrando o quadril para trás, como se quisesse tocar uma parede com os glúteos.
4. Desça o peso mantendo as costas retas, sentindo o alongamento dos músculos posteriores da coxa.
5. Desça até onde sua flexibilidade permitir, sem curvar a lombar.
6. Retorne à posição inicial contraindo os glúteos e posteriores para trazer o quadril para frente.`,
        gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif'
    },
    {
      name: 'Cadeira Flexora',
      description: `Equipamento: Máquina (Cadeira Flexora).
1. Sente-se na máquina com as costas apoiadas e ajuste o rolo para ficar atrás dos tornozelos.
2. Segure os apoios laterais para estabilidade.
3. Flexione os joelhos, puxando o rolo em direção aos glúteos de forma controlada.
4. Contraia os músculos posteriores no pico do movimento.
5. Retorne à posição inicial lentamente, resistindo ao peso.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/08/Seated-Leg-Curl.gif'
    },
    {
      name: 'Mesa Flexora (Flexora Deitada)',
      description: `Equipamento: Máquina (Mesa Flexora).
1. Deite-se de bruços na máquina, ajustando o rolo de apoio para que fique na parte de trás dos tornozelos.
2. Mantenha o quadril pressionado contra o banco.
3. Flexione os joelhos, trazendo os calcanhares em direção aos glúteos.
4. Contraia os músculos posteriores no pico do movimento.
5. Retorne à posição inicial lentamente.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2022/05/Lying-leg-curl.gif'
    },
  ],
  'Glúteos': [
    {
        name: 'Hip Thrust (Elevação Pélvica)',
        description: `Equipamento: Barra, Banco.
1. Sente-se no chão com as costas (região das escápulas) apoiadas em um banco.
2. Posicione a barra sobre o seu quadril.
3. Mantenha os pés firmes no chão, afastados na largura dos ombros.
4. Eleve o quadril, empurrando a barra para cima até que seu corpo forme uma linha reta dos ombros aos joelhos.
5. Contraia os glúteos no topo do movimento.
6. Desça o quadril de forma controlada, quase tocando o chão, e repita.`,
        gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif'
    },
    {
      name: 'Cadeira Abdutora',
      description: `Equipamento: Máquina (Cadeira Abdutora).
1. Sente-se na máquina com as costas bem apoiadas no encosto.
2. Posicione a parte externa das coxas contra as almofadas de apoio.
3. Afaste as pernas, empurrando as almofadas para fora, de forma controlada.
4. Mantenha a contração dos glúteos por um instante no final do movimento.
5. Retorne à posição inicial lentamente, resistindo à força da máquina.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/HiP-ABDUCTION-MACHINE.gif'
    },
    {
      name: 'Agachamento Búlgaro',
      description: `Equipamento: Halteres (opcional), Banco.
1. Fique de costas para um banco. Segure halteres se desejar carga extra.
2. Coloque o peito de um pé no banco.
3. A perna da frente deve estar a uma distância que permita um agachamento confortável.
4. Agache, flexionando o joelho da perna da frente até a coxa ficar paralela ao chão. Mantenha o tronco ereto.
5. Empurre com o calcanhar da frente para voltar à posição inicial.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2023/03/Bulgarian-Jump-Squat.gif'
    }
  ],
  'Adutores': [
    {
      name: 'Cadeira Adutora',
      description: `Equipamento: Máquina (Cadeira Adutora).
1. Sente-se na máquina com as costas bem apoiadas e posicione a parte interna das coxas contra as almofadas.
2. Selecione o peso desejado.
3. Inicie com as pernas afastadas.
4. Force as pernas para se unirem, contraindo os músculos adutores (parte interna da coxa).
5. Retorne à posição inicial de forma lenta e controlada.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/HIP-ADDUCTION-MACHINE.gif'
    }
  ],
  'Peito': [
     {
      name: 'Supino Reto com Barra',
      description: `Equipamento: Barra, Banco.
1. Deite-se em um banco reto. Os pés devem estar firmes no chão.
2. Segure a barra com uma pegada um pouco mais aberta que a largura dos ombros.
3. Retire a barra do suporte e posicione-a acima do peito com os braços estendidos.
4. Desça a barra de forma controlada até tocar a parte média do peito.
5. Empurre a barra de volta à posição inicial, contraindo o peitoral. Pode ser feito com halteres para maior amplitude.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif'
    }
  ],
  'Costas': [
    {
        name: 'Puxada Frontal',
        description: `Equipamento: Máquina (Pulley).
1. Sente-se no aparelho e ajuste o apoio dos joelhos para que suas pernas fiquem firmes.
2. Segure a barra com uma pegada mais aberta que a largura dos ombros, com as palmas das mãos voltadas para frente.
3. Mantenha o tronco ligeiramente inclinado para trás e o peito estufado.
4. Puxe a barra em direção à parte superior do peito, contraindo os músculos das costas (dorsais).
5. Retorne a barra à posição inicial de forma controlada, estendendo completamente os braços.`,
        gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif'
    },
    {
        name: 'Remada Curvada',
        description: `Equipamento: Barra.
1. Fique em pé, com os pés na largura dos ombros. Segure a barra com as palmas das mãos voltadas para baixo.
2. Incline o tronco para frente, mantendo as costas retas e os joelhos ligeiramente flexionados. O tronco deve ficar quase paralelo ao chão.
3. Puxe a barra em direção ao seu abdômen, mantendo os cotovelos próximos ao corpo e contraindo os músculos das costas.
4. Abaixe a barra de forma controlada até que os braços estejam totalmente estendidos.`,
        gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif'
    },
  ],
  'Ombros': [
    {
      name: 'Desenvolvimento com Halteres',
      description: `Equipamento: Halteres, Banco.
1. Sente-se em um banco com encosto, segurando um halter em cada mão na altura dos ombros, com as palmas voltadas para frente.
2. Mantenha os pés firmes no chão e as costas apoiadas no banco.
3. Empurre os halteres para cima e para dentro, até que os braços estejam quase totalmente estendidos acima da cabeça.
4. Desça os halteres de forma controlada até a posição inicial, na altura dos ombros.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif'
    },
    {
      name: 'Elevação Lateral',
      description: `Equipamento: Halteres.
1. Fique em pé, com os pés na largura dos ombros, segurando um halter em cada mão ao lado do corpo.
2. Mantenha os cotovelos ligeiramente flexionados.
3. Eleve os braços para os lados até que os halteres atinjam a altura dos ombros.
4. O movimento deve ser focado nos ombros, evitando balançar o corpo.
5. Desça os halteres de forma controlada até a posição inicial.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif'
    }
  ],
  'Tríceps': [
    {
      name: 'Tríceps Corda',
      description: `Equipamento: Máquina (Pulley), Corda.
1. Fique de pé em frente a uma polia alta com o acessório de corda.
2. Segure a corda com as duas mãos, mantendo os cotovelos próximos ao corpo.
3. Puxe a corda para baixo, estendendo completamente os braços e afastando as pontas da corda no final do movimento.
4. Contraia o tríceps no final da extensão.
5. Retorne à posição inicial de forma controlada, resistindo ao peso.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Rope-Pushdown.gif'
    }
  ],
  'Bíceps': [
    {
      name: 'Rosca Direta',
      description: `Equipamento: Barra.
1. Fique em pé, com os pés na largura dos ombros, segurando uma barra com as palmas das mãos voltadas para cima.
2. Mantenha os cotovelos fixos ao lado do corpo.
3. Flexione os cotovelos, levantando a barra em direção ao peito.
4. Contraia o bíceps no topo do movimento.
5. Desça a barra de forma controlada até a posição inicial, estendendo completamente os braços.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif'
    }
  ],
  'Panturrilha': [
    {
      name: 'Panturrilha em pé',
      description: `Equipamento: Máquina específica ou Step/Plataforma.
1. Posicione-se em uma máquina específica para panturrilha em pé ou use uma plataforma para elevar os calcanhares.
2. Mantenha o corpo ereto e os joelhos ligeiramente flexionados.
3. Eleve os calcanhares o máximo que puder, contraindo as panturrilhas.
4. Segure a contração por um instante no topo.
5. Desça os calcanhares de forma controlada, alongando os músculos abaixo da posição inicial, se estiver em uma plataforma.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif'
    },
    {
      name: 'Panturrilha sentado',
      description: `Equipamento: Máquina específica.
1. Sente-se na máquina de panturrilha sentado e posicione a almofada sobre a parte inferior das coxas.
2. Coloque a ponta dos pés na plataforma, com os calcanhares para fora.
3. Eleve os calcanhares, empurrando a almofada para cima com a força das panturrilhas.
4. Contraia os músculos no pico do movimento.
5. Desça os calcanhares de forma controlada até sentir um leve alongamento.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Foam-Roller-Calves.gif'
    }
  ],
  'Abdômen/Core': [
    {
      name: 'Prancha',
      description: `Equipamento: Nenhum.
1. Apoie os antebraços e as pontas dos pés no chão.
2. Mantenha o corpo reto como uma prancha, da cabeça aos calcanhares.
3. Contraia o abdômen e os glúteos para evitar que o quadril caia.
4. Mantenha a posição pelo tempo desejado, respirando de forma constante.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2023/07/High-Plank.gif'
    },
    {
      name: 'Elevação de Pernas Deitado',
      description: `Equipamento: Nenhum.
1. Deite-se de costas com as pernas estendidas e as mãos sob o quadril para apoio.
2. Mantenha as pernas retas e eleve-as até formarem um ângulo de 90 graus com o chão.
3. Baixe as pernas de forma lenta e controlada, sem deixar que toquem o chão completamente.
4. Mantenha o abdômen contraído durante todo o movimento.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif'
    },
    {
      name: 'Abdominal "Bicicleta"',
      description: `Equipamento: Nenhum.
1. Deite-se de costas com as mãos atrás da cabeça e os joelhos dobrados.
2. Eleve os ombros do chão e traga um joelho em direção ao peito.
3. Ao mesmo tempo, gire o tronco para levar o cotovelo oposto em direção a esse joelho.
4. Alterne os lados em um movimento contínuo, como se estivesse a pedalar.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif'
    },
    {
      name: 'Ponte de Glúteos',
      description: `Equipamento: Nenhum.
1. Deite-se de costas com os joelhos dobrados, pés apoiados no chão na largura do quadril.
2. Contraia os glúteos e o abdômen para elevar o quadril do chão.
3. Forme uma linha reta dos ombros aos joelhos no topo do movimento.
4. Mantenha a posição por um segundo e depois desça de forma controlada.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge-.gif'
    }
  ],
  'Cardio': [
    {
      name: 'Corda',
      description: `Equipamento: Corda de pular.
1. Segure as manoplas da corda, uma em cada mão.
2. Mantenha os cotovelos próximos ao corpo e use os pulsos para girar a corda.
3. Salte baixo, apenas o suficiente para a corda passar sob os seus pés.
4. Mantenha um ritmo constante e o abdômen contraído.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2023/10/Skip-Jump-Rope.gif'
    },
    {
      name: 'Polichinelos',
      description: `Equipamento: Nenhum.
1. Comece em pé, com os pés juntos e os braços ao lado do corpo.
2. Salte, afastando as pernas e levantando os braços acima da cabeça ao mesmo tempo.
3. Retorne à posição inicial com outro salto.
4. Mantenha um ritmo rápido e contínuo.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Jumping-jack.gif'
    },
    {
      name: 'Corrida na Esteira',
      description: `Equipamento: Esteira.
1. Selecione a velocidade e inclinação desejadas na esteira.
2. Comece a caminhar e aumente gradualmente a velocidade para uma corrida confortável.
3. Mantenha uma postura ereta, com os ombros relaxados e o olhar para a frente.
4. Use os braços para ajudar no impulso e no equilíbrio.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Treadmill-.gif'
    },
    {
      name: 'Burpees',
      description: `Equipamento: Nenhum.
1. Comece em pé, agache e coloque as mãos no chão.
2. Salte com os pés para trás, entrando em posição de prancha.
3. Faça uma flexão (opcional).
4. Salte com os pés para a frente, voltando à posição de agachamento.
5. Salte explosivamente para cima com os braços estendidos.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/10/Jack-Burpees.gif'
    }
  ],
  'Alongamentos': [
    {
      name: 'Alongamento de Posteriores Sentado',
      description: `Equipamento: Nenhum.
1. Sente-se no chão com as pernas estendidas à sua frente.
2. Incline o tronco para a frente a partir do quadril, mantendo as costas o mais retas possível.
3. Tente alcançar os seus pés com as mãos.
4. Mantenha o alongamento por 20-30 segundos, sentindo a parte de trás das coxas.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Seated-Hamstring-Stretch.gif'
    },
    {
      name: 'Alongamento de Quadríceps em Pé',
      description: `Equipamento: Nenhum (use uma parede para apoio, se necessário).
1. Fique em pé e segure em algo para se equilibrar.
2. Puxe um dos pés em direção ao glúteo, segurando o tornozelo.
3. Mantenha os joelhos juntos e o quadril alinhado.
4. Sinta o alongamento na parte da frente da coxa. Mantenha por 20-30 segundos e troque de lado.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/08/Standing-Quadriceps-Stretch.gif'
    },
    {
      name: 'Alongamento Gato-Vaca',
      description: `Equipamento: Nenhum.
1. Fique na posição de quatro apoios, com as mãos sob os ombros e os joelhos sob o quadril.
2. Inspire enquanto arqueia as costas para baixo, olhando para cima (posição da Vaca).
3. Expire enquanto arredonda as costas para cima, olhando para o umbigo (posição do Gato).
4. Alterne entre as duas posições de forma lenta e controlada.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/cat-cow.gif'
    },
    {
      name: 'Alongamento de Peito na Parede',
      description: `Equipamento: Parede ou batente de porta.
1. Coloque o antebraço na parede, com o cotovelo na altura do ombro.
2. Gire o corpo para o lado oposto, afastando-se da parede, até sentir um alongamento no peito e no ombro.
3. Mantenha por 20-30 segundos e depois troque de lado.`,
      gifUrl: 'https://fitnessprogramer.com/wp-content/uploads/2023/07/wall-supported-handstand-push-up.gif'
    }
  ]
};