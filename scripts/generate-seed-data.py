#!/usr/bin/env python3
"""
Generate all LEOptical seed data CSVs from a single source of truth.

Produces:
  Module 1 (CRM):
    static/seed-data/contacts.csv    — ~50,000 Contacts

  Modules 6-8 (Data 360):
    static/seed-data/loyalty_members.csv   — ~40,000 loyalty program members
    static/seed-data/ecommerce_orders.csv  — ~100,000 orders + line items
    static/seed-data/exam_history.csv      — ~35,000 eye exam records

  Later modules (simulation):
    static/seed-data/new_signups_july.csv      — ~50 new loyalty members
    static/seed-data/new_orders_july.csv       — ~100 recent orders
    static/seed-data/new_contacts_batch1.csv   — ~20 new contacts

Usage:
    python3 scripts/generate-seed-data.py

No dependencies beyond the Python standard library.
"""

import csv
import os
import random
import re
from datetime import date, timedelta
from pathlib import Path

# ── Configuration ────────────────────────────────────────────────────────────

SEED = 42  # Deterministic output
CONTACT_COUNT = 48_672  # Background contacts only (protagonists created separately via Apex)
LOYALTY_COUNT = 40_471
ORDER_COUNT = 98_314
EXAM_COUNT = 33_829

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / 'static' / 'seed-data'

# Reference date — all date generation is relative to this
TODAY = date(2026, 8, 1)

# ── Product Catalog ──────────────────────────────────────────────────────────

PRODUCTS = [
    {'sku': 'VIS-ULX-001', 'name': 'Visionaire UltraLux',       'family': 'Visionaire', 'price': 349.00},
    {'sku': 'VIS-CHS-001', 'name': 'Visionaire ChromaShift',     'family': 'Visionaire', 'price': 299.00},
    {'sku': 'SEC-DLF-001', 'name': 'SeeClear DailyFocus',        'family': 'SeeClear',   'price': 189.00},
    {'sku': 'SEC-SNS-001', 'name': 'SeeClear SunSync',           'family': 'SeeClear',   'price': 219.00},
    {'sku': 'LEO-FRM-001', 'name': 'LEOptical Designer Frames',  'family': 'Frames',     'price': 159.00},
]

# Orphaned SKUs — referenced in ecommerce orders but don't exist in Product table
ORPHANED_SKUS = ['VIS-PRO-001', 'SEC-NIT-001']

# ── US States ────────────────────────────────────────────────────────────────

STATES = [
    'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
    'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT',
]

# ── Name Pools (from scripts/generate-name-lists.py) ─────────────────────────

FIRST_NAMES = [
    'Margaud', 'Vincent', 'Esperanza', 'Jade', 'Rufino',
    'Banjeet', 'Wendy', 'Spencer', 'Gabrielle', 'Micaela',
    'Humberto', 'Yolanda', 'Raquel', 'Brenda', 'Joyce',
    'Susan', 'Ira', 'Joseph', 'Collin', 'Emanuella',
    'Dulce', 'Guillermo', 'Leslie', 'Thomas', 'Luiz Fernando',
    'Lindsey', 'Teresa', 'Chelsea', 'Arcelia', 'Espartaco',
    'Manuel', 'Meghan', 'Vanesa', 'Socorro', 'Maryse',
    'James', 'Gaurang', 'Bertrand', 'Chad', 'Veer',
    'Alex', 'Patricia', 'Heitor', 'Frank', 'Upasna',
    'Rachel', 'Emilia', 'Laura', 'Alonso', 'Elisa',
    'Magdalena', 'Amy', 'Zacharie', 'Janani', 'Angela',
    'Yash', 'Lourdes', 'Andrea', 'Jeremy', 'Jeffery',
    'Jennifer', 'Rodrigo', 'Ronald', 'Ana Beatriz', 'Mariano',
    'Rodolfo', 'John', 'Julie', 'Mary', 'Diego',
    'Carolina', 'Pablo', 'Luke', 'Sabine', 'Luiz Felipe',
    'Nathalie', 'Pauline', 'Leah', 'Amador', 'Wanda',
    'Michelle', 'Adam', 'Deborah', 'Pietro', 'Perla',
    'Lucas', 'Yvette', 'Brian', 'Jerry', 'Rodney',
    'Debra', 'Natasha', 'Nicholas', 'Edhitha', 'Jaqueline',
    'Estela', 'Gabriel', 'Alfonso', 'Claire', 'Tracey',
    'Rita', 'Alexandra', 'Tracy', 'Anthony', 'Jason',
    'Jorge', 'Jessica', 'Danielle', 'Pamela', 'Gerardo',
    'Lorenzo', 'Blanca', 'Oviya', 'Ignacio', 'Cristian',
    'Federico', 'Nancy', 'Mirella', 'Gautam', 'Lavanya',
    'Juliette', 'Kyle', 'Neel', 'Kathryn', 'Fabiola',
    'Maria Flor', 'Emily', 'George', 'Wesley', 'Anna',
    'Armando', 'Alma', 'Janet', 'Yashodhara', 'Conchita',
    'Audrey', 'Yashasvi', 'Gregorio', 'Kimberly', 'Salma',
    'Maximiliano', 'Lindsay', 'Destiny', 'Chaaya', 'Veronica',
    'Ana Luisa', 'Marcelle', 'Eduardo', 'Natalie', 'Florencia',
    'Amber', 'Cheryl', 'Amanda', 'Brooke', 'Thibault',
    'Tanya', 'Berta', 'Isaac', 'Nikita', 'Natividad',
    'Odika', 'Clarice', 'Minerva', 'Tammy', 'Fidel',
    'Mayte', 'Brayan', 'Aurelio', 'Darlene', 'Selena',
    'Juliana', 'Dennis', 'Felipe', 'Wilfrido', 'Dominique',
    'Julio', 'Marcela', 'Nihal', 'Enrique', 'Leonardo',
    'Sheila', 'Thierry', 'Barbara', 'Daniel', 'Angel',
    'Erin', 'Warinder', 'Christopher', 'Elizabeth', 'Gilberto',
    'Mitchell', 'Enzo', 'Ivonne', 'Renato', 'Aaron',
    'Abhimanyu', 'Matthew', 'Reynaldo', 'Tasha', 'Noah',
    'Gonzalo', 'Kenneth', 'Sarah', 'Porfirio', 'Melinda',
    'Abigail', 'Vitor Gabriel', 'Emiliano', 'Katie', 'Itzel',
    'Martin', 'Rebecca', 'Diana', 'Kristin', 'Craig',
    'Hermelinda', 'Rosa', 'Mike', 'Charlotte', 'Lisa',
    'Earl', 'Zayyan', 'Cynthia', 'Panini', 'Triya',
    'Tina', 'Guillermina', 'Monica', 'Ruby', 'Ravy',
    'Robin', 'Alvaro', 'Davi Luiz', 'Luis', 'Martha',
    'Dalbir', 'Dev', 'Georgina', 'Santiago', 'Citlali',
    'Reginald', 'Javier', 'Megan', 'Richard', 'Lucky',
    'Mark', 'Antonio', 'Dana', 'Irma', 'Scott',
    'Aldo', 'Steven', 'Francisca', 'Charles', 'Gustavo',
    'Cecilia', 'Bryan', 'Modesto', 'Camille', 'Bernard',
    'Nadia', 'Whitney', 'David', 'Anastasie', 'Carlota',
    'Odette', 'Robert', 'Todd', 'Ofelia', 'Advaith',
    'Shawn', 'Israel', 'Maria', 'Jeffrey', 'Enzo Gabriel',
    'Andrew', 'Samuel', 'Michele', 'Jill', 'Joshua',
    'Sudiksha', 'Joe', 'Chantal', 'Nicole', 'Linda',
    'Eric', 'Juan', 'Octavio', 'Melanie', 'Alexander',
    'Monique', 'Lauren', 'Louis', 'Connor', 'Virginia',
    'Jacob', 'Ashley', 'Jacqueline', 'Jon', 'Valerie',
    'Crystal', 'Tara', 'Frederick', 'Sandra', 'Heather',
    'Desiree', 'Kaitlyn', 'Walter', 'Bobby', 'Kendra',
    'Jared', 'April', 'Brittany', 'Benjamin', 'Kayla',
    'Melody', 'Toni', 'Brent', 'Christine', 'Brandon',
    'Stephen', 'Christian', 'Cory', 'Douglas', 'Shaun',
    'Theresa', 'Christina', 'Kirk', 'Shannon', 'Victoria',
    'Beverly', 'Carolyn', 'Arthur', 'Peter', 'Michael',
    'Christie', 'Kristine', 'Sean', 'Alan', 'Trevor',
    'Joanna', 'Ricardo', 'Billy', 'Karen', 'Marcus',
    'Erica', 'Erika', 'Caroline', 'Kelly', 'William',
    'Gary', 'Katherine', 'Malik', 'Paul', 'Taylor',
    'Kathy', 'Ian', 'Kiara', 'Jose', 'Dean',
    'Kari', 'Erik', 'Randy', 'Ryan', 'Dylan',
    'Patrick', 'Meredith', 'Phillip', 'Edward', 'Ronnie',
    'Stephanie', 'Timothy', 'Allen', 'Anita', 'Victor',
    'Kevin', 'Ricky', 'Vickie', 'Justin', 'Stacy',
    'Melissa', 'Gerald', 'Chris', 'Alejandro', 'Diane',
    'Cathy', 'Zachary', 'Nathan', 'Kirsten', 'Kara',
    'Paula', 'Curtis', 'Cindy', 'Sherry', 'Jenna',
    'Cassie', 'Tyrone', 'Damon', 'Jonathan', 'Candace',
    'Jake', 'Bridget', 'Rachael', 'Alicia', 'Dakota',
    'Gregory', 'Molly', 'Clifford', 'Francisco', 'Allison',
    'Jesse', 'Maureen', 'Clinton', 'Barry', 'Ellen',
    'Carl', 'Joel', 'Morgan', 'Tony', 'Norman',
    'Alexis', 'Hayley', 'Jamie', 'Gina', 'Darrell',
    'Savannah', 'Catherine', 'Austin', 'Calvin', 'Traci',
    'Garrett', 'Alyssa', 'Derrick', 'Raymond', 'Tyler',
    'Madeline', 'Sheri', 'Jillian', 'Holly', 'Corey',
    'Dawn', 'Keith', 'Adrian', 'Ivan', 'Jeff',
    'Greg', 'Lorraine', 'Brittney', 'Katelyn', 'Donna',
    'Sharon', 'Carlos', 'Shari', 'Jack', 'Dustin',
    'Lori', 'Seth', 'Terri', 'Betty', 'Clayton',
    'Carrie', 'Jaime', 'Jimmy', 'Larry', 'Jonathon',
    'Nathaniel', 'Tiffany', 'Edwin', 'Kristen', 'Sara',
    'Karina', 'Alison', 'Sabrina', 'Andre', 'Courtney',
    'Glenn', 'Kim', 'Donald', 'Lance', 'Rickey',
    'Sheena', 'Jermaine', 'Eileen', 'Derek', 'Suzanne',
    'Laurie', 'Wayne', 'Alfred', 'Samantha', 'Penny',
    'Philip', 'Alexandria', 'Francis', 'Beth', 'Joan',
    'Jasmine', 'Rhonda', 'Krystal', 'Stacey', 'Faith',
]

LAST_NAMES = [
    'Morvan', 'Quintana', 'Kade', 'Luevano', 'Lemus',
    'Borges', 'Ahuja', 'Cardoso', 'Velasquez', 'Bueno',
    'Quintanilla', 'West', 'Pelayo', 'Rivas', 'Decker',
    'Davis', 'Le', 'Soliz', 'Portillo', 'Bonneau',
    'Castillo', 'Laureano', 'Sahota', 'Moore', 'Ferreira',
    'Carranza', 'Moraes', 'Deshpande', 'Hernandez', 'Cowan',
    'Seguin', 'Roy', 'Orosco', 'Ryan', 'Lawrence',
    'Ramirez', 'Caldeira', 'Urbina', 'Welch', 'Chakraborty',
    'Sangha', 'Sanchez', 'Aubry', 'Maestas', 'Brunet',
    'Baca', 'Ocasio', 'Doyle', 'Gonzalez', 'Figueroa',
    'Segovia', 'Barros', 'Olmos', 'Walker', 'Guevara',
    'Anderson', 'Villanueva', 'Shields', 'Sodhi', 'Deshmukh',
    'Toledo', 'Adame', 'Henson', 'Foster', 'Lin',
    'Baker', 'Lee', 'Vigil', 'Guerra', 'Clark',
    'Huerta', 'Torres', 'Haro', 'Fonseca', 'Grijalva',
    'Meyer', 'Burgos', 'Wagner', 'Saxena', 'Blair',
    'Jurado', 'Cervantes', 'Miller', 'Shetty', 'Bonnin',
    'Pierce', 'Zamora', 'Duncan', 'White', 'Roque',
    'Mena', 'Brennan', 'Smith', 'Gracia', 'Lynch',
    'de Anda', 'Harvey', 'Jasso', 'Dube', 'Almanza',
    'Hickman', 'Mata', 'Heredia', 'Williams', 'Seth',
    'Diaz', 'Hodges', 'Granado', 'Montgomery', 'Warner',
    'Gray', 'Ruiz', 'Cherry', 'Wright', 'Herrera',
    'Spears', 'Owens', 'Jordan', 'Richard', 'Henderson',
    'Mcmillan', 'Montenegro', 'Costa', 'Robinson', 'da Cunha',
    'Fowler', 'Fabre', 'Cardona', 'Ferrell', 'Huff',
    'Alves', 'Jhaveri', 'Natarajan', 'Galloway', 'Lewis',
    'Brito', 'Amador', 'Guillet', 'Mojica', 'Comar',
    'Wise', 'Garica', 'Joubert', 'Palomo', 'Colunga',
    'Morgan', 'Santos', 'Suarez', 'Cuellar', 'Adams',
    'Orta', 'da Rocha', 'Arellano', 'Arroyo', 'Navarro',
    'Harris', 'Le Goff', 'Oliver', 'Gomes', 'Gardner',
    'Graham', 'Garrison', 'Munoz', 'Adkins', 'Hahn',
    'Ruelas', 'Gamez', 'Walla', 'Whitehead', 'Alejandro',
    'Tran', 'Mckay', 'Edwards', 'Grenier', 'Sierra',
    'Bousquet', 'Lira', 'Archer', 'Martins', 'Angulo',
    'de la Torre', 'Krish', 'Hill', 'Bowers', 'Nunez',
    'Lopez', 'Hicks', 'Tanguy', 'Nolan', 'Higgins',
    'Rhodes', 'Rosado', 'Dyal', 'Cardenas', 'Cazares',
    'Bahena', 'Jacobs', 'Wolfe', 'Valdivia', 'Martin',
    'Anguiano', 'Gulati', 'Garcia', 'Zuniga', 'Zedillo',
    'Valles', 'House', 'da Cruz', 'Mallick', 'Rocha',
    'Keith', 'del Valle', 'Anand', 'Medrano', 'Sosa',
    'Pacheco', 'Fernandes', 'Duarte', 'Casares', 'Ramos',
    'Rael', 'Donovan', 'Lozano', 'Ortiz', 'Castro',
    'Johnson', 'Rogers', 'Rice', 'Farrell', 'Leblanc',
    'Texier', 'Wilson', 'Chaudhuri', 'Galvan', 'Barbosa',
    'Ray', 'Regalado', 'Mueller', 'Osorio', 'Sethi',
    'Poulain', 'Carrasco', 'Perea', 'Khalsa', 'Moreno',
    'Green', 'Baria', 'Guardado', 'Patla', 'Campos',
    'Moran', 'Burton', 'Toro', 'Borrego', 'Yu',
    'Calvillo', 'Salmon', 'Phillips', 'Carre', 'Collins',
    'Villareal', 'Iglesias', 'Madrigal', 'Marques', 'Aguilar',
    'Altamirano', 'Valencia', 'Franco', 'Cohen', 'Parsons',
    'Ellis', 'Callahan', 'Mahoney', 'Freitas', 'Georges',
    'Chapman', 'da Mata', 'Novais', 'Goda', 'Leonard',
    'Rodrigues', 'Aguayo', 'Caldwell', 'Nunes', 'Silva',
    'Ware', 'Morales', 'Perez', 'Brown', 'Thaman',
    'Berthelot', 'Irizarry', 'Ozuna', 'Mann', 'Ibarra',
    'Barraza', 'Harrell', 'Saiz', 'Jones', 'Walton',
    'Melgar', 'Daniel', 'Thompson', 'Lawson', 'Contreras',
    'Meadows', 'Bell', 'Young', 'Peterson', 'Aguirre',
    'Acosta', 'Dunlap', 'Alexander', 'Dawson', 'Montoya',
    'Howard', 'Choi', 'Pratt', 'Thomas', 'Alvarez',
    'Gibson', 'Bradley', 'Mcdaniel', 'Bartlett', 'Tucker',
    'Bailey', 'Evans', 'Nichols', 'Henry', 'Wood',
    'Stewart', 'Sharp', 'Lara', 'Sweeney', 'Rollins',
    'Jackson', 'Clements', 'Savage', 'Gomez', 'Mcintosh',
    'Reynolds', 'Holt', 'Bush', 'Allen', 'Lucas',
    'Wilkerson', 'Ward', 'Hood', 'Mercado', 'Mcdonald',
    'Sherman', 'Roberts', 'Baldwin', 'Moon', 'Woodard',
    'Irwin', 'Harrison', 'Austin', 'Hurst', 'Rubio',
    'Waters', 'Medina', 'Mejia', 'Fernandez', 'Oneill',
    'Petersen', 'Garrett', 'Reyes', 'Gregory', 'Luna',
    'Fisher', 'Richmond', 'Spencer', 'Holder', 'Charles',
    'Manning', 'Rowe', 'Ball', 'Guzman', 'Ho',
    'Payne', 'Mcknight', 'Carter', 'Hopkins', 'Berry',
    'Murphy', 'Butler', 'Cunningham', 'Bradshaw', 'Greene',
    'Carlson', 'Dennis', 'Ferguson', 'Myers', 'Nelson',
    'Cruz', 'Rodriguez', 'Boyer', 'Gamble', 'Craig',
    'Crawford', 'King', 'Burnett', 'Parker', 'Ashley',
    'Miles', 'Mccoy', 'Steele', 'Hamilton', 'Curtis',
    'Maldonado', 'Wilkins', 'Bonilla', 'Andrade', 'Arnold',
    'Turner', 'Kirk', 'Fleming', 'Richardson', 'Morrow',
    'Lloyd', 'Benson', 'Hughes', 'Moses', 'Kim',
    'Hall', 'Franklin', 'Mckinney', 'Hutchinson', 'Hooper',
    'Eaton', 'Jenkins', 'Branch', 'Church', 'Newman',
    'Joyce', 'Jimenez', 'Carr', 'Mcneil', 'Hayes',
    'Watson', 'Schneider', 'Gilbert', 'Avila', 'Herring',
    'James', 'Stone', 'Schmidt', 'Knight', 'Summers',
    'Beck', 'Lindsey', 'Mosley', 'Grant', 'Sanders',
    'Stanley', 'Underwood', 'Glass', 'Vasquez', 'Warren',
    'Sexton', 'Taylor', 'Gutierrez', 'Stevens', 'Brooks',
    'Day', 'Lam', 'Robertson', 'Barnett', 'Barnes',
    'Burns', 'Mitchell', 'Beard', 'Terry', 'Blackwell',
    'Daniels', 'Harper', 'Reeves', 'Barry', 'Riley',
    'Sims', 'Scott', 'Floyd', 'Kelly', 'Fletcher',
    'Odonnell', 'Long', 'Hudson', 'Haynes', 'Mccormick',
    'Simon', 'Valenzuela', 'Andrews', 'Marshall', 'Quinn',
    'Meyers', 'Malone', 'Cooper', 'Howell', 'Levy',
]

# Nickname variants for IDR testing
NICKNAMES = {
    'James': ['Jim', 'J.'],
    'William': ['Will', 'Bill'],
    'Robert': ['Rob', 'Bob'],
    'Richard': ['Rich', 'Rick'],
    'Joseph': ['Joe', 'J.'],
    'Christopher': ['Chris', 'C.'],
    'Daniel': ['Dan', 'D.'],
    'Matthew': ['Matt', 'M.'],
    'Anthony': ['Tony', 'A.'],
    'Jennifer': ['Jen', 'J.'],
    'Elizabeth': ['Liz', 'Beth'],
    'Jessica': ['Jess', 'J.'],
    'Katherine': ['Kate', 'Kathy'],
    'Rebecca': ['Becca', 'Becky'],
    'Timothy': ['Tim', 'T.'],
    'Nicholas': ['Nick', 'N.'],
    'Benjamin': ['Ben', 'B.'],
    'Jonathan': ['Jon', 'J.'],
    'Andrew': ['Andy', 'A.'],
    'David': ['Dave', 'D.'],
}


# ── Helper Functions ─────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    """Convert a name to a lowercase email-safe slug."""
    return re.sub(r'[^a-z]', '', name.lower())


def make_email(first: str, last: str, counter: int) -> str:
    """Generate a deterministic email address."""
    first_slug = slugify(first)
    last_slug = slugify(last) if last else 'unknown'
    return f"{first_slug}.{last_slug}.{counter:06d}@example.com"


def make_alt_email(first: str, last: str, counter: int, variant: int) -> str:
    """Generate a variant email for IDR testing."""
    first_slug = slugify(first)
    last_slug = slugify(last)
    if variant == 0:
        # First initial only
        return f"{first_slug[0]}.{last_slug}.{counter:06d}@example.com"
    elif variant == 1:
        # Different subdomain
        return f"{first_slug}.{last_slug}.{counter:06d}@personal.example.com"
    else:
        # Swapped order
        return f"{last_slug}.{first_slug}.{counter:06d}@example.com"


def make_typo_email(email: str, rng: random.Random) -> str:
    """Introduce a single-character typo into an email."""
    local = email.split('@')[0]
    domain = email.split('@')[1]
    if len(local) < 3:
        return email
    pos = rng.randint(1, len(local) - 2)  # Avoid first/last char
    char = local[pos]
    # Swap with adjacent letter or duplicate
    if char.isalpha():
        replacement = chr(ord(char) + 1) if char != 'z' else 'a'
    else:
        replacement = char
    return local[:pos] + replacement + local[pos + 1:] + '@' + domain


def tier_for_points(points: int) -> str:
    if points >= 75_000:
        return 'Platinum'
    if points >= 50_000:
        return 'Gold'
    if points >= 25_000:
        return 'Silver'
    return 'Bronze'


def phone_for_index(i: int, rng: random.Random) -> str:
    """Generate a phone number in one of 4 inconsistent formats (dirty data)."""
    area = 200 + (abs(i * 7) % 800)
    prefix = 200 + (abs(i * 13) % 800)
    line = abs(i * 31) % 10000
    fmt = i % 4
    ac = str(area)
    pfx = str(prefix)
    ln = str(line).zfill(4)
    if fmt == 0:
        return f"({ac}) {pfx}-{ln}"
    elif fmt == 1:
        return f"{ac}-{pfx}-{ln}"
    elif fmt == 2:
        return f"{ac}{pfx}{ln}"
    else:
        return f"+1{ac}{pfx}{ln}"


def random_date_between(start: date, end: date, rng: random.Random) -> date:
    """Return a random date between start and end inclusive."""
    delta = (end - start).days
    if delta <= 0:
        return start
    return start + timedelta(days=rng.randint(0, delta))


# ── Master Person Registry ──────────────────────────────────────────────────

class Person:
    """A single person in the master registry. May appear across multiple files."""
    __slots__ = [
        'id', 'first_name', 'last_name', 'email', 'phone', 'state',
        'loyalty_tier', 'loyalty_points', 'last_exam_date', 'next_exam_due',
        'record_type',  # 'contact' or 'protagonist'
        # Cross-file tracking
        'loyalty_email', 'ecommerce_email', 'exam_email',
        'in_loyalty', 'in_ecommerce', 'in_exams',
        'email_variant',  # 'same', 'alt', 'typo'
        'nickname',  # Alternate first name for IDR name-variation testing
    ]

    def __init__(self):
        for attr in self.__slots__:
            setattr(self, attr, None)
        self.in_loyalty = False
        self.in_ecommerce = False
        self.in_exams = False
        self.email_variant = 'same'
        self.nickname = None


def generate_master_registry(rng: random.Random) -> list[Person]:
    """Generate all contacts including protagonists. All go into contacts.csv
    with @example.com emails. Protagonist emails are updated by the learner
    in Module 4 via anonymous Apex."""
    people = []
    email_counter = 1  # Protagonists get 1-10, background starts at 11
    fn_size = len(FIRST_NAMES)
    ln_size = len(LAST_NAMES)

    # ── Protagonist contacts ─────────────────────────────────────────────
    protagonist_data = [
        {'first': 'Maria',   'last': 'Chen',       'tier': 'Gold',     'pts': 62000,  'exam': 'overdue_14m'},
        {'first': 'James',   'last': 'Okafor',     'tier': 'Platinum', 'pts': 89000,  'exam': 'current_2m'},
        {'first': 'Sofia',   'last': 'Reyes',      'tier': 'Bronze',   'pts': 1200,   'exam': 'never'},
        {'first': 'David',   'last': 'Kim',         'tier': 'Silver',   'pts': 32000,  'exam': 'overdue_18m'},
        {'first': 'Aisha',   'last': 'Patel',      'tier': 'Gold',     'pts': 58000,  'exam': 'current_4m'},
        {'first': 'Carlos',  'last': 'Mendez',      'tier': 'Bronze',   'pts': 8500,   'exam': 'never'},
        {'first': 'Wei',     'last': 'Zhang',      'tier': 'Platinum', 'pts': 102000, 'exam': 'current_1m'},
        {'first': 'Fatima',  'last': 'Al-Hassan',   'tier': 'Silver',   'pts': 25000,  'exam': 'overdue_13m'},
        {'first': 'Ryan',    'last': "O'Brien",     'tier': 'Bronze',   'pts': 3200,   'exam': 'current_6m'},
        {'first': 'Priya',   'last': 'Sharma',      'tier': 'Gold',     'pts': 71000,  'exam': 'current_3m'},
    ]

    for p_data in protagonist_data:
        p = Person()
        p.id = email_counter
        p.first_name = p_data['first']
        p.last_name = p_data['last']
        p.email = make_email(p.first_name, p.last_name, email_counter)
        p.phone = phone_for_index(email_counter, rng)
        p.state = STATES[email_counter % len(STATES)]
        p.loyalty_tier = p_data['tier']
        p.loyalty_points = p_data['pts']
        p.record_type = 'protagonist'

        # Exam dates
        exam = p_data['exam']
        if exam == 'never':
            p.last_exam_date = None
            p.next_exam_due = None
        elif exam.startswith('current_'):
            months = int(exam.split('_')[1].rstrip('m'))
            p.last_exam_date = TODAY - timedelta(days=months * 30)
            p.next_exam_due = p.last_exam_date + timedelta(days=365)
        elif exam.startswith('overdue_'):
            months = int(exam.split('_')[1].rstrip('m'))
            p.last_exam_date = TODAY - timedelta(days=months * 30)
            p.next_exam_due = p.last_exam_date + timedelta(days=365)

        # Protagonists appear in Data 360 data sources with consistent emails
        p.in_loyalty = True
        p.in_ecommerce = p_data['exam'] != 'never' or p_data['pts'] > 5000
        p.in_exams = p_data['exam'] != 'never'
        p.loyalty_email = p.email
        p.ecommerce_email = p.email
        p.exam_email = p.email

        people.append(p)
        email_counter += 1

    # ── Background Contacts ──────────────────────────────────────────────
    contact_count = CONTACT_COUNT - 10  # 10 protagonists already added
    used_names: set[tuple[str, str]] = {(p.first_name, p.last_name) for p in people}
    for i in range(contact_count):
        p = Person()
        p.id = email_counter
        # Coprime walk for diverse name distribution, skip duplicate combos
        first_idx = (i * 7) % fn_size
        last_idx = (i * 13 + i // fn_size) % ln_size
        fn = FIRST_NAMES[first_idx]
        ln = LAST_NAMES[last_idx]
        while (fn, ln) in used_names:
            last_idx = (last_idx + 1) % ln_size
            ln = LAST_NAMES[last_idx]
        used_names.add((fn, ln))
        p.first_name = fn
        p.last_name = ln

        p.email = make_email(p.first_name, p.last_name, email_counter)
        p.phone = phone_for_index(email_counter, rng)
        p.state = STATES[email_counter % len(STATES)]
        p.record_type = 'contact'

        # Loyalty tier distribution: ~40% Bronze, ~30% Silver, ~20% Gold, ~10% Platinum
        tier_roll = i % 10
        if tier_roll < 4:
            p.loyalty_tier = 'Bronze'
            p.loyalty_points = rng.randint(0, 24_999)
        elif tier_roll < 7:
            p.loyalty_tier = 'Silver'
            p.loyalty_points = rng.randint(25_000, 49_999)
        elif tier_roll < 9:
            p.loyalty_tier = 'Gold'
            p.loyalty_points = rng.randint(50_000, 74_999)
        else:
            p.loyalty_tier = 'Platinum'
            p.loyalty_points = rng.randint(75_000, 120_000)

        # Boundary cases for segmentation testing (exact tier thresholds)
        if i == 100:
            p.loyalty_points = 25_000
            p.loyalty_tier = 'Silver'
        elif i == 200:
            p.loyalty_points = 50_000
            p.loyalty_tier = 'Gold'
        elif i == 300:
            p.loyalty_points = 75_000
            p.loyalty_tier = 'Platinum'

        # Exam dates: ~60% have had an exam, ~40% of those are overdue
        exam_roll = i % 10
        if exam_roll < 4:
            p.last_exam_date = None
            p.next_exam_due = None
        elif exam_roll < 7:
            days_ago = 30 + (abs(i * 17) % 300)
            p.last_exam_date = TODAY - timedelta(days=days_ago)
            p.next_exam_due = p.last_exam_date + timedelta(days=365)
        else:
            days_ago = 396 + (abs(i * 13) % 548)
            p.last_exam_date = TODAY - timedelta(days=days_ago)
            p.next_exam_due = p.last_exam_date + timedelta(days=365)

        people.append(p)
        email_counter += 1

    return people


def assign_cross_file_membership(people: list[Person], rng: random.Random):
    """Decide which people appear in loyalty, ecommerce, and exam files.
    Also assign email variants for IDR testing."""

    non_protagonists = [p for p in people if p.record_type == 'contact']

    # ── Loyalty members (~40,000) ────────────────────────────────────────
    # Protagonists are already marked in_loyalty
    loyalty_candidates = rng.sample(non_protagonists, min(LOYALTY_COUNT - 10, len(non_protagonists)))
    for p in loyalty_candidates:
        p.in_loyalty = True

    # ── Ecommerce orders (~100,000 orders across a subset of people) ────
    # ~45,000 unique buyers, some with multiple orders
    ecomm_candidates = rng.sample(non_protagonists, min(45_000, len(non_protagonists)))
    for p in ecomm_candidates:
        p.in_ecommerce = True

    # ── Exam history (~35,000) ───────────────────────────────────────────
    exam_candidates = [p for p in people if p.last_exam_date is not None]
    for p in exam_candidates:
        p.in_exams = True
    # Fill remaining exam slots from contacts without exam dates
    remaining = EXAM_COUNT - len(exam_candidates)
    if remaining > 0:
        no_exam = [p for p in non_protagonists if p.last_exam_date is None]
        extra = rng.sample(no_exam, min(remaining, len(no_exam)))
        for p in extra:
            p.in_exams = True
            days_ago = rng.randint(30, 900)
            p.last_exam_date = TODAY - timedelta(days=days_ago)
            p.next_exam_due = p.last_exam_date + timedelta(days=365)

    # ── Assign email variants for IDR testing ────────────────────────────
    # For people in multiple files, decide if their email differs
    multi_file = [p for p in people
                  if (p.in_loyalty or p.in_ecommerce or p.in_exams)
                  and p.record_type != 'protagonist']

    rng.shuffle(multi_file)
    n = len(multi_file)

    # ~70% same email everywhere
    same_cutoff = int(n * 0.70)
    # ~15% alt email in one source
    alt_cutoff = same_cutoff + int(n * 0.15)
    # ~2% typo email
    typo_cutoff = alt_cutoff + int(n * 0.02)
    # rest: same email (rounding)

    for i, p in enumerate(multi_file):
        if i < same_cutoff:
            p.email_variant = 'same'
        elif i < alt_cutoff:
            p.email_variant = 'alt'
        elif i < typo_cutoff:
            p.email_variant = 'typo'
        else:
            p.email_variant = 'same'

    # Now assign the actual variant emails
    for p in multi_file:
        if p.email_variant == 'same':
            p.loyalty_email = p.email
            p.ecommerce_email = p.email
            p.exam_email = p.email
        elif p.email_variant == 'alt':
            variant = rng.randint(0, 2)
            alt = make_alt_email(p.first_name, p.last_name, p.id, variant)
            # Put the alt in one randomly chosen source
            target = rng.choice(['loyalty', 'ecommerce', 'exam'])
            p.loyalty_email = alt if target == 'loyalty' else p.email
            p.ecommerce_email = alt if target == 'ecommerce' else p.email
            p.exam_email = alt if target == 'exam' else p.email
        elif p.email_variant == 'typo':
            typo = make_typo_email(p.email, rng)
            target = rng.choice(['loyalty', 'ecommerce', 'exam'])
            p.loyalty_email = typo if target == 'loyalty' else p.email
            p.ecommerce_email = typo if target == 'ecommerce' else p.email
            p.exam_email = typo if target == 'exam' else p.email

    # ── Shared household emails (~50 cases) ──────────────────────────────
    # Pick 50 pairs of people and give them the same email in one source
    household_candidates = [p for p in non_protagonists
                            if p.in_loyalty and p.last_name]
    rng.shuffle(household_candidates)
    for i in range(0, min(100, len(household_candidates)), 2):
        p1 = household_candidates[i]
        p2 = household_candidates[i + 1]
        # Shared family email
        shared = f"the{slugify(p1.last_name)}s.{p1.id:06d}@example.com"
        p1.loyalty_email = shared
        p2.loyalty_email = shared

    # ── Duplicate CRM contacts (3 intentional near-duplicates) ───────────
    # Pick 3 contacts and create near-duplicates by slightly tweaking data.
    # These use record_type='duplicate' so they are excluded from contacts.csv
    # (which goes through Data Import Wizard and would trigger duplicate rules)
    # but included in Data 360 source files for identity resolution testing.
    dupe_sources = rng.sample(
        [p for p in non_protagonists if p.last_name],
        3
    )
    for src in dupe_sources:
        dupe = Person()
        dupe.id = max(p.id for p in people) + 1
        dupe.first_name = src.first_name
        dupe.last_name = src.last_name
        dupe.email = make_email(src.first_name, src.last_name, dupe.id)
        dupe.phone = src.phone  # Same phone — giveaway it's a dupe
        dupe.state = src.state
        dupe.loyalty_tier = src.loyalty_tier
        dupe.loyalty_points = src.loyalty_points + rng.randint(-500, 500)
        dupe.last_exam_date = src.last_exam_date
        dupe.next_exam_due = src.next_exam_due
        dupe.record_type = 'duplicate'
        people.append(dupe)

    # ── Case inconsistency (~20 records) ─────────────────────────────────
    case_candidates = [p for p in non_protagonists
                       if p.in_loyalty
                       and p.loyalty_email and '@' in (p.loyalty_email or '')]
    rng.shuffle(case_candidates)
    for p in case_candidates[:20]:
        local, domain = p.loyalty_email.split('@')
        p.loyalty_email = local.title() + '@' + domain.title()

    # ── Name variations for IDR testing ──────────────────────────────────
    name_var_candidates = [p for p in non_protagonists
                           if p.in_loyalty and p.first_name in NICKNAMES]
    rng.shuffle(name_var_candidates)
    # Store the variant name to use in loyalty/ecommerce files
    for p in name_var_candidates[:50]:
        variants = NICKNAMES[p.first_name]
        p.nickname = rng.choice(variants)


def generate_contacts_csv(people: list[Person]):
    """Write contacts.csv for Data Import Wizard. Includes all contacts (protagonists + background)."""
    contacts = [p for p in people if p.record_type in ('contact', 'protagonist')]
    path = OUTPUT_DIR / 'contacts.csv'
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Account Name',
            'FirstName', 'LastName', 'Email', 'Phone', 'MailingState',
            'Loyalty Tier', 'Loyalty Points',
            'Last Exam Date', 'Next Exam Due',
        ])
        for p in contacts:
            writer.writerow([
                'LEOptical Customers',
                p.first_name,
                p.last_name,
                p.email,
                p.phone,
                p.state,
                p.loyalty_tier,
                p.loyalty_points,
                p.last_exam_date.isoformat() if p.last_exam_date else '',
                p.next_exam_due.isoformat() if p.next_exam_due else '',
            ])
    print(f"  contacts.csv: {len(contacts):,} rows")



def generate_loyalty_csv(people: list[Person], rng: random.Random):
    """Write loyalty_members.csv for Data 360 CSV data stream."""
    members = [p for p in people if p.in_loyalty]
    path = OUTPUT_DIR / 'loyalty_members.csv'

    # Track stale data: ~500 members will have Gold tier but sub-Gold points
    stale_count = 0
    stale_target = 500

    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'membership_number', 'first_name', 'last_name', 'email', 'phone',
            'loyalty_tier', 'points_balance', 'enrollment_date', 'status',
            'email_optin', 'unsubscribed_date',
        ])
        for i, p in enumerate(members):
            member_id = f"LM-{i + 1:05d}"

            # Use nickname variant if assigned
            first = p.nickname or p.first_name
            last = p.last_name or ''

            email = p.loyalty_email or p.email

            # ~5% missing email (dirty data)
            if i % 20 == 0 and p.record_type != 'protagonist':
                email = ''

            # Enrollment date — 1 to 4 years ago
            enrollment = TODAY - timedelta(days=rng.randint(365, 1460))
            # Format as DD-Mon-YYYY (dirty data — different from CRM format)
            enrollment_str = enrollment.strftime('%d-%b-%Y')

            status = 'Active' if rng.random() > 0.05 else 'Inactive'

            # Loyalty tier & points — mostly correct, but ~500 are stale
            tier = p.loyalty_tier or tier_for_points(rng.randint(0, 100_000))
            points = p.loyalty_points or rng.randint(0, 100_000)

            if stale_count < stale_target and tier != 'Gold' and points < 50_000 and p.record_type != 'protagonist':
                # Stale data: tier says Gold but points disagree
                tier = 'Gold'
                stale_count += 1

            # Contradictory consent signals (~30 records)
            email_optin = 'true' if rng.random() > 0.1 else 'false'
            unsub_date = ''
            if email_optin == 'true' and rng.random() < 0.001:
                # Contradictory: opted in but also has unsubscribe date
                unsub_date = (TODAY - timedelta(days=rng.randint(10, 200))).strftime('%d-%b-%Y')

            # Null vs empty vs "N/A" for phone (~3% each)
            phone = p.phone or ''
            null_roll = rng.random()
            if null_roll < 0.03:
                phone = ''
            elif null_roll < 0.06:
                phone = 'N/A'
            elif null_roll < 0.09:
                phone = 'n/a'

            writer.writerow([
                member_id, first, last, email, phone,
                tier, points, enrollment_str, status,
                email_optin, unsub_date,
            ])
    print(f"  loyalty_members.csv: {len(members):,} rows")


def generate_ecommerce_csv(people: list[Person], rng: random.Random):
    """Write ecommerce_orders.csv for Data 360 CSV data stream.
    Contains both order header and line item data in a denormalized format."""
    buyers = [p for p in people if p.in_ecommerce]
    path = OUTPUT_DIR / 'ecommerce_orders.csv'

    # ── Protagonist orders (fixed, known purchase histories) ────────────
    # These use @example.com emails. The learner's CRM contacts have
    # different emails (+alias). IDR links them in Module 9.
    protagonist_orders = [
        # Maria Chen — SeeClear DailyFocus + SeeClear SunSync
        {'email': 'maria.chen.000001@example.com', 'sku': 'SEC-DLF-001', 'price': 189.00, 'date': '03/15/2026'},
        {'email': 'maria.chen.000001@example.com', 'sku': 'SEC-SNS-001', 'price': 219.00, 'date': '11/22/2025'},
        # James Okafor — Visionaire UltraLux
        {'email': 'james.okafor.000002@example.com', 'sku': 'VIS-ULX-001', 'price': 349.00, 'date': '05/10/2026'},
        # David Kim — Visionaire ChromaShift (lapsed — 200+ days ago)
        {'email': 'david.kim.000004@example.com', 'sku': 'VIS-CHS-001', 'price': 299.00, 'date': '01/08/2026'},
        # Aisha Patel — SeeClear DailyFocus
        {'email': 'aisha.patel.000005@example.com', 'sku': 'SEC-DLF-001', 'price': 189.00, 'date': '04/20/2026'},
        # Carlos Mendez — Visionaire UltraLux
        {'email': 'carlos.mendez.000006@example.com', 'sku': 'VIS-ULX-001', 'price': 349.00, 'date': '06/05/2026'},
        # Wei Zhang — all 4 lens products
        {'email': 'wei.zhang.000007@example.com', 'sku': 'VIS-ULX-001', 'price': 349.00, 'date': '07/01/2026'},
        {'email': 'wei.zhang.000007@example.com', 'sku': 'VIS-CHS-001', 'price': 299.00, 'date': '05/15/2026'},
        {'email': 'wei.zhang.000007@example.com', 'sku': 'SEC-DLF-001', 'price': 189.00, 'date': '03/22/2026'},
        {'email': 'wei.zhang.000007@example.com', 'sku': 'SEC-SNS-001', 'price': 219.00, 'date': '01/30/2026'},
        # Fatima Al-Hassan — SeeClear SunSync
        {'email': 'fatima.alhassan.000008@example.com', 'sku': 'SEC-SNS-001', 'price': 219.00, 'date': '02/14/2026'},
        # Priya Sharma — Visionaire ChromaShift + Visionaire UltraLux
        {'email': 'priya.sharma.000010@example.com', 'sku': 'VIS-CHS-001', 'price': 299.00, 'date': '06/18/2026'},
        {'email': 'priya.sharma.000010@example.com', 'sku': 'VIS-ULX-001', 'price': 349.00, 'date': '04/02/2026'},
    ]

    orders = []
    order_counter = 100_001
    unique_order_count = 0

    for po in protagonist_orders:
        order_id = f"ORD-{order_counter}"
        order_counter += 1
        orders.append({
            'order_id': order_id,
            'customer_email': po['email'],
            'order_date': po['date'],
            'order_total': po['price'],
            'order_status': 'Completed',
            'order_source': 'ecommerce',
            'line_item_id': f"{order_id}-LI1",
            'product_sku': po['sku'],
            'quantity': 1,
            'unit_price': po['price'],
            'line_total': po['price'],
        })
        unique_order_count += 1

    # ── Random orders ────────────────────────────────────────────────────
    # Distribute remaining orders across buyers (1-8 orders each)

    for p in buyers:
        num_orders = rng.choices([1, 2, 3, 4, 5, 6, 7, 8],
                                  weights=[30, 25, 20, 10, 6, 4, 3, 2])[0]
        for _ in range(num_orders):
            if unique_order_count >= ORDER_COUNT:
                break
            order_id = f"ORD-{order_counter}"
            order_counter += 1

            # Order date — between 2 years ago and today
            order_date = random_date_between(TODAY - timedelta(days=730), TODAY, rng)

            # Use ecommerce email (may differ from CRM)
            email = p.ecommerce_email or p.email

            # 1-3 line items per order
            num_items = rng.choices([1, 2, 3], weights=[60, 30, 10])[0]
            line_items = []
            order_total = 0.0

            for li in range(num_items):
                # ~2% chance of orphaned SKU (dirty data)
                if rng.random() < 0.02:
                    product = {'sku': rng.choice(ORPHANED_SKUS), 'price': rng.uniform(100, 400)}
                else:
                    product = rng.choice(PRODUCTS)

                qty = rng.choices([1, 2], weights=[85, 15])[0]
                unit_price = product['price']
                line_total = round(unit_price * qty, 2)
                order_total += line_total

                line_items.append({
                    'line_item_id': f"{order_id}-LI{li + 1}",
                    'product_sku': product['sku'],
                    'quantity': qty,
                    'unit_price': unit_price,
                    'line_total': line_total,
                })

            # Order status
            status_roll = rng.random()
            if status_roll < 0.85:
                status = 'Completed'
            elif status_roll < 0.93:
                status = 'Cancelled'
            else:
                status = 'Returned'

            # Date format — MM/DD/YYYY (dirty data — different from CRM)
            date_str = order_date.strftime('%m/%d/%Y')

            # "Lapsed" boundary case: exactly 180 days ago
            if unique_order_count == 500:
                date_str = (TODAY - timedelta(days=180)).strftime('%m/%d/%Y')

            for li in line_items:
                orders.append({
                    'order_id': order_id,
                    'customer_email': email,
                    'order_date': date_str,
                    'order_total': round(order_total, 2),
                    'order_status': status,
                    'order_source': 'ecommerce',
                    'line_item_id': li['line_item_id'],
                    'product_sku': li['product_sku'],
                    'quantity': li['quantity'],
                    'unit_price': li['unit_price'],
                    'line_total': li['line_total'],
                })
            unique_order_count += 1
        if unique_order_count >= ORDER_COUNT:
            break

    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'order_id', 'customer_email', 'order_date', 'order_total',
            'order_status', 'order_source',
            'line_item_id', 'product_sku', 'quantity', 'unit_price', 'line_total',
        ])
        for row in orders:
            writer.writerow([
                row['order_id'], row['customer_email'], row['order_date'],
                row['order_total'], row['order_status'], row['order_source'],
                row['line_item_id'], row['product_sku'], row['quantity'],
                row['unit_price'], row['line_total'],
            ])

    unique_orders = len(set(r['order_id'] for r in orders))
    print(f"  ecommerce_orders.csv: {len(orders):,} line item rows ({unique_orders:,} unique orders)")


def generate_exam_csv(people: list[Person], rng: random.Random):
    """Write exam_history.csv for Data 360 CSV data stream."""
    exam_people = [p for p in people if p.in_exams]
    path = OUTPUT_DIR / 'exam_history.csv'

    exam_types = ['Comprehensive', 'Follow-up', 'Contact Lens Fitting']
    providers = [
        'Dr. Martinez', 'Dr. Singh', 'Dr. Thompson', 'Dr. Nguyen',
        'Dr. Williams', 'Dr. Patel', 'Dr. Chen', 'Dr. Davis',
        'Dr. Garcia', 'Dr. Robinson',
    ]

    rows = []
    exam_counter = 50_001

    for p in exam_people:
        exam_id = f"EX-{exam_counter}"
        exam_counter += 1

        email = p.exam_email or p.email
        exam_date = p.last_exam_date or random_date_between(
            TODAY - timedelta(days=900), TODAY, rng
        )
        next_due = p.next_exam_due or (exam_date + timedelta(days=365))

        # Date format: DD-Mon-YYYY (dirty data — different from CRM and ecommerce)
        exam_date_str = exam_date.strftime('%d-%b-%Y')
        next_due_str = next_due.strftime('%d-%b-%Y')

        # Some records use different date format for extra messiness
        if rng.random() < 0.05:
            exam_date_str = exam_date.isoformat()  # YYYY-MM-DD

        rows.append({
            'exam_id': exam_id,
            'patient_email': email,
            'patient_first_name': p.first_name,
            'patient_last_name': p.last_name or '',
            'exam_date': exam_date_str,
            'next_exam_due': next_due_str,
            'exam_type': rng.choice(exam_types),
            'provider_name': rng.choice(providers),
        })

    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'exam_id', 'patient_email', 'patient_first_name', 'patient_last_name',
            'exam_date', 'next_exam_due', 'exam_type', 'provider_name',
        ])
        for row in rows:
            writer.writerow([
                row['exam_id'], row['patient_email'],
                row['patient_first_name'], row['patient_last_name'],
                row['exam_date'], row['next_exam_due'],
                row['exam_type'], row['provider_name'],
            ])
    print(f"  exam_history.csv: {len(rows):,} rows")


def generate_simulation_csvs(rng: random.Random):
    """Generate the small simulation CSVs for later modules."""

    # ── new_signups_july.csv (~50 new loyalty signups) ───────────────────
    path = OUTPUT_DIR / 'new_signups_july.csv'
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'membership_number', 'first_name', 'last_name', 'email', 'phone',
            'loyalty_tier', 'points_balance', 'enrollment_date', 'status',
            'email_optin', 'unsubscribed_date',
        ])
        for i in range(50):
            fn = FIRST_NAMES[(i * 3) % len(FIRST_NAMES)]
            ln = LAST_NAMES[(i * 7) % len(LAST_NAMES)]
            email = f"{slugify(fn)}.{slugify(ln)}.new{i:03d}@example.com"
            enrollment = date(2026, 7, 1) + timedelta(days=rng.randint(0, 30))
            writer.writerow([
                f"LM-N{i + 1:04d}",
                fn, ln, email,
                phone_for_index(90_000 + i, rng),
                'Bronze', rng.randint(0, 500),
                enrollment.strftime('%d-%b-%Y'),
                'Active', 'true', '',
            ])
    print(f"  new_signups_july.csv: 50 rows")

    # ── new_orders_july.csv (~100 recent orders) ─────────────────────────
    path = OUTPUT_DIR / 'new_orders_july.csv'
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'order_id', 'customer_email', 'order_date', 'order_total',
            'order_status', 'order_source',
            'line_item_id', 'product_sku', 'quantity', 'unit_price', 'line_total',
        ])
        for i in range(100):
            fn = FIRST_NAMES[(i * 11) % len(FIRST_NAMES)]
            ln = LAST_NAMES[(i * 13) % len(LAST_NAMES)]
            email = f"{slugify(fn)}.{slugify(ln)}.new{i:03d}@example.com"
            order_date = date(2026, 7, 1) + timedelta(days=rng.randint(0, 30))
            product = rng.choice(PRODUCTS)
            qty = 1
            total = product['price']
            writer.writerow([
                f"ORD-N{i + 1:05d}", email,
                order_date.strftime('%m/%d/%Y'),
                total, 'Completed', 'ecommerce',
                f"ORD-N{i + 1:05d}-LI1",
                product['sku'], qty, product['price'], total,
            ])
    print(f"  new_orders_july.csv: 100 rows")

    # ── new_contacts_batch1.csv (~20 new contacts) ───────────────────────
    path = OUTPUT_DIR / 'new_contacts_batch1.csv'
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'FirstName', 'LastName', 'Email', 'Phone', 'MailingState',
        ])
        for i in range(20):
            fn = FIRST_NAMES[(i * 19) % len(FIRST_NAMES)]
            ln = LAST_NAMES[(i * 23) % len(LAST_NAMES)]
            email = f"{slugify(fn)}.{slugify(ln)}.batch{i:03d}@example.com"
            writer.writerow([
                fn, ln, email,
                phone_for_index(95_000 + i, rng),
                STATES[i % len(STATES)],
            ])
    print(f"  new_contacts_batch1.csv: 20 rows")


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    rng = random.Random(SEED)
    print("Generating LEOptical seed data...\n")

    print(f"Step 1: Building master person registry ({CONTACT_COUNT:,} contacts)...")
    people = generate_master_registry(rng)
    print(f"  Total contacts: {len(people):,}")
    print(f"  Protagonists: {sum(1 for p in people if p.record_type == 'protagonist'):,}")

    print("\nStep 2: Assigning cross-file membership and email variants...")
    assign_cross_file_membership(people, rng)
    loyalty_count = sum(1 for p in people if p.in_loyalty)
    ecomm_count = sum(1 for p in people if p.in_ecommerce)
    exam_count = sum(1 for p in people if p.in_exams)
    print(f"  Loyalty members: {loyalty_count:,}")
    print(f"  Ecommerce buyers: {ecomm_count:,}")
    print(f"  Exam patients: {exam_count:,}")

    print(f"\nStep 3: Writing CSVs to {OUTPUT_DIR}/")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    generate_contacts_csv(people)
    generate_loyalty_csv(people, rng)
    generate_ecommerce_csv(people, rng)
    generate_exam_csv(people, rng)

    print("\nStep 4: Writing simulation CSVs...")
    generate_simulation_csvs(rng)

    # ── Summary stats ────────────────────────────────────────────────────
    print("\n── Summary ─────────────────────────────────────────────")
    alt_emails = sum(1 for p in people if p.email_variant == 'alt')
    typo_emails = sum(1 for p in people if p.email_variant == 'typo')
    print(f"  People with alt email in one source: {alt_emails:,}")
    print(f"  People with typo email in one source: {typo_emails:,}")

    print("\nDone. All CSVs written to static/seed-data/")


if __name__ == '__main__':
    main()
