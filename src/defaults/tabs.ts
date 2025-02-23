import { Tab } from "../types/tabs";
const smoke = `
e|----------------|----------------|----------------|------------------|
B|----------------|----------------|----------------|------------------|
G|-----3---5------|---3---6-5------|-----3---5----3-|------------------|
D|-5---3---5----5-|---3---6-5------|-5---3---5----3-|---5--------------| x5
A|-5------------5-|----------------|-5--------------|---5--------------|
E|----------------|----------------|----------------|------------------|
 
e|----------------|----------------|----------------|------------------|
B|----------------|----------------|----------------|------------------|
G|-----3---5------|---3---6-5------|-----3---5----3-|------------------|
D|-5---3---5----5-|---3---6-5------|-5---3---5----3-|---5--------(5)\--|
A|-5------------5-|----------------|-5--------------|---5--------(5)\--|
E|----------------|----------------|----------------|------------------|
`;
const wonderwall = `
[Verse] 
Em7        G                             Dsus4                  A7sus4
  Today is gonna be the day that they're gonna throw it back to you
Em7          G                     Dsus4               A7sus4
  By now you should've somehow realized what you gotta do
Em7                  G       Dsus4           A7sus4
I don't believe that anybody feels the way I do
          Cadd9    Dsus4    A7sus4
About you now
 
[Verse]
Em7              G                              Dsus4                A7sus4
   Backbeat, the word is on the street that the fire in your heart is out
Em7                G                           Dsus4              A7sus4
   I'm sure you've heard it all before but you never really had a doubt
Em7                  G       Dsus4           A7sus4
I don't believe that anybody feels the way I do
          Em7   G     Dsus4     A7sus4
about you now
 `;

const heaven = `
[Solo]
 
e|----5---------------------|----8-8-8b--8p5------8-10p8--------------|
B|------8-5-----------------|-8b-------------8/10--------10-8----8h10-|
G|-7b-------7-5---7-5-------|---------------------------------10------|
D|--------------7-----7-5---|-----------------------------------------|
A|------------------------8-|-----------------------------------------|
E|--------------------------|-----------------------------------------|
 
e|------5-----------------------------------|
B|----5---8p5-------------------------------|
G|-7b---------7-5---7-5-----------5---5-5p0-|
D|----------------7-----7-5---5-7---7-------|
A|--------------------------7---------------|
E|------------------------------------------|
 
e|-5----------------------------|
B|---8-5------------------------|
G|-------7-5---7-5--------------|
D|-----------7-----7-5-7-5------|
A|-------------------------8~10-|
E|------------------------------|
 
e|--------------------|-------------------|
B|--------------------|----------------13-|
G|--------------------|-------12-12h14----|
D|-----10h12p10----10-|-12/14-------------|
A|-/12----------12----|-------------------|
E|--------------------|-------------------|
 
e|--------------------|-15b-15p13-|
B|-15b-15p13-15p13----|-----------|
G|-----------------14-|-----------|
D|--------------------|-----------|
A|--------------------|-----------|
E|--------------------|-----------|
`;

const sun = `[Intro]
| Am | C | D | F |
| Am | E | Am | E |
 
 
[Verse 1]
      Am   C        D           F
There is a house in New Orleans
     Am        C      E     E
They call the "Rising Sun"
         Am       C       D             F
And it's been the ruin of many a poor boy
    Am     E        | Am | C | D | F | Am | E | Am | E |
And God, I know, I'm one               (organ plays E7)
 
 
[Verse 2]
   Am     C     D        F
My mother was a tailor (organ: F7)
    Am       C        E     E
She sewed my new blue jeans (organ: E7)
   Am     C     D        F
My father was a gambling man
Am      E    | Am | C | D | F | Am | E | Am | E |
Down in New Orleans.            (organ plays E7)
 
 
[Verse 3]
        Am   C       D         F
Now the only thing a gambler needs (organ: F7)
     Am       C     E     E
Is a suitcase and a trunk (organ: E7)
        Am   C      D           F
And the only time, he's satisfied,
   Am        E    | Am | C | D | F | Am | E | Am | E |
Is when he's on a drunk              (organ plays E7)
 
 
[Organ Solo]
| Am | C | D | F |
| Am | C | E | % |
| Am | C | D | F |
| Am | E |
| Am | C/E | D | F |
| Am | E | Am | E |
 
 
[Verse 4]
    Am     C              D       F
Oh, mother, tell your children (organ: F7)
       Am      C      E     E
Not to do what I have done (organ: E7)
Am         C        D            F
Spend your lives in sin and misery
       Am           E     | Am | C | D | F | Am | E | Am | E |
In the House of the Rising Sun              (organ plays E7)
 
 
[Verse 5]
            Am       C      D           F
Well, I got one foot on the platform (organ plays F7)
    Am         C        E     E
The other foot on the train (organ: E7)
    Am    C       D           F
I'm going back to New Orleans (organ: F7)
   Am        E       | Am | C | D | F | Am | E | Am | E |
To wear that ball and chain             (organ plays E7#9)
 
 
[Verse 6]
            Am   C        D           F
Well, there is a house in New Orleans (organ: F7)
     Am        C      E     E
They call the "Rising Sun" (organ: E7)
         Am       C       D           F
And it's been the ruin of many a poor boy
    Am     E7      | Am | C | D | F7 | Am | E7 |
And God, I know, I'm one
 
 
[Coda]
| Am | Dm | Am | Dm | Am | Dm |
(a tempo)
| Am | Dm | Am | Dm | Am
   (ritardando)     (organ plays Am9; guitar equivalent: x-0-5-5-5-7)`;

const defaultTabs: Tab[] = [
  { name: "House of The Rising Run", tab: sun },
  { name: "Smoke On The Water", tab: smoke },
  { name: "Wonderwall", tab: wonderwall },
  { name: "Stairway To Heaven Solo", tab: heaven },
];

export default defaultTabs;
