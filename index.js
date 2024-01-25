import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';

operation()

function operation() {
  console.clear();
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar conta',
          'Consultar Saldo',
          'Depositar',
          'Sacar',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']

      console.clear();
      switch (action) {
        case 'Criar conta':
          createAccount();
        break;
        case 'Depositar':
          deposit(); 
        break;
        case 'Consultar Saldo':
          getAccountBalance(); 
        break;
        case 'Sacar':
          withdraw(); 
        break;
        case 'Sair':
          console.log(chalk.blue('Obrigado por usar o Accounts!!!'));
        break;
      }
    })
}

// create user account
function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
  console.log(chalk.green('Defina as opções da sua conta a seguir'))
  buildAccount()
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Digite um nome para a sua conta:',
      },
    ])
    .then((answer) => {
      console.info(answer['accountName'])

      const accountName = answer['accountName']

      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
        )
        buildAccount();
        return;
      }else{
        fs.writeFileSync(
          `accounts/${accountName}.json`,
          '{"balance":0}',
          function (err) {
            console.log(err)
          },  
        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        )
      }
      operation()
    })
}

function deposit() {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Digite o nome da sua conta: ',
  }]).then(answer => {
    const accountName = answer['accountName'];

    if(!CheckAccount(accountName)) {
      return deposit();
    }

    inquirer.prompt([{
      name: 'amount',
      message: 'Digite o valor a ser depositado: ',
    }]).then(answer => {
      const amount = answer['amount'];

      addAmount(accountName, amount);
      inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Deseja depositar novamente em alguma conta?',
          choices: [
            'Sim',
            'Não',
          ],
        },
      ]).then(answer => {
        const choice = answer['action'];
        console.log(choice);
        
        switch(choice) {
          case 'Sim': 
            console.clear();
            deposit(); 
          break;
          case 'Não':
            operation(); 
          break;
        }
      }).catch(err => console.log(err))

    }).catch(err => console.log(err));

  }).catch(err => {console.log(err)});
}

function CheckAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)){
    console.log(chalk.red('Conta não existe'));
    return false;
  }

  return true;
}

function addAmount(accountName, amount){
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.red('Ocorreu um erro, tente novamente mais tarde'));
    return;
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
  
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.log(err);
    },
  )

  console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`));
}


function getAccount(accountName) {
  const accountJSON = fs.readFileSync(
    `accounts/${accountName}.json`,
    {
      encoding: 'utf8',
      flag: 'r'
    }
  )

  return JSON.parse(accountJSON);

}


function getAccountBalance() {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Digite o nome da sua conta: ',
  }]).then(answer => {
    const accountName = answer['accountName'];
    if(!CheckAccount(accountName)){
      getAccountBalance();
    }else{
      const accountBalance = getAccount(accountName).balance
      console.log(chalk.blue(`a conta de ${chalk.yellow(accountName)} possui um total de R$${chalk.green(accountBalance)}`));
      inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Deseja consultar novamente uma conta?',
          choices: [
            'Sim',
            'Não',
          ],
        },
      ]).then(answer => {
        const choice = answer['action'];
        console.log(choice);
        
        switch(choice) {
          case 'Sim': 
            console.clear();
            getAccountBalance(); 
          break;
          case 'Não':
            operation(); 
          break;
        }
  
      }).catch(err => console.log(err));
    }
  }).catch(err => console.log(err));
}

function withdraw() {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Digite o nome da sua conta: ',
  }]).then(answer => {
    const accountName = answer['accountName'];

    if(!CheckAccount(accountName)) {
      return withdraw();
    }

    inquirer.prompt([{
      name: 'amount',
      message: 'Digite o valor a ser sacado: ',
    }]).then(answer => {
      const amount = answer['amount'];

      withdrawAmount(accountName, amount);

    }).catch(err => console.log(err));

  }).catch(err => {console.log(err)});
}

function withdrawAmount(accountName, amount){
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.red('Ocorreu um erro, tente novamente mais tarde'));
    return;
  }else if(accountData.balance < amount) {
    console.log(chalk.red('Saldo indisponivel na conta!'))
    return withdraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.log(err);
    },
  )
  parseFloat(amount)  
  console.log(chalk.green(`Foi sacado o valor de R$${amount} da sua conta`));
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Deseja sacar novamente em alguma conta?',
      choices: [
        'Sim',
        'Não',
      ],
    },
  ]).then(answer => {
    const choice = answer['action'];
    console.log(choice);
    
    switch(choice) {
      case 'Sim': 
        console.clear();
        withdraw(); 
      break;
      case 'Não':
        operation(); 
      break;
    }
  }).catch(err => console.log(err))
}