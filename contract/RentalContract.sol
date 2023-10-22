// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmlakKiralamaKontrati {
    address public sahibi;

    struct Mulk {
        address sahip;
        string adres;
        string tip;
        uint256 kiraUcreti;
        bool kiralandi;
        address kiraci;
        uint256 baslangicTarihi;
        uint256 bitisTarihi;
    }

    Mulk[] public mulkler;

    mapping(address => bool) public kiraciMulkSahibi;
    mapping(address => Mulk) public kiraciMulk;

    event MulkEklendi(
        address indexed sahip,
        uint256 mulkID,
        string adres,
        string tip,
        uint256 kiraUcreti
    );
    event BasvuruYapildi(
        address indexed kiraci,
        uint256 mulkID,
        uint256 baslangicTarihi,
        uint256 bitisTarihi
    );
    event KiralamaOnaylandi(
        address indexed sahip,
        uint256 mulkID,
        address indexed kiraci
    );
    event SozlesmeSonlandirildi(address indexed kiraci, uint256 mulkID);

    constructor() {
        sahibi = msg.sender;
    }

    modifier sadeceSahip() {
        require(
            msg.sender == sahibi,
            "Bu islem sadece sahip tarafindan gerceklestirilebilir."
        );
        _;
    }

    function ilanAc(
        string memory _adres,
        string memory _tip,
        uint256 _kiraUcreti
    ) public {
        require(
            !kiraciMulkSahibi[msg.sender],
            "Bir kiraci ayni zamanda bir mulk sahibi olamaz."
        );

        Mulk memory yeniMulk = Mulk({
            sahip: msg.sender,
            adres: _adres,
            tip: _tip,
            kiraUcreti: _kiraUcreti,
            kiralandi: false,
            kiraci: address(0),
            baslangicTarihi: 0,
            bitisTarihi: 0
        });
        mulkler.push(yeniMulk);
        emit MulkEklendi(
            msg.sender,
            mulkler.length - 1,
            _adres,
            _tip,
            _kiraUcreti
        );
    }

    function ilanlariListele() public view returns (Mulk[] memory) {
        return mulkler;
    }

    function basvuruYap(
        uint256 mulkID,
        uint256 _baslangicTarihi,
        uint256 _bitisTarihi
    ) public {
        require(mulkID < mulkler.length, "Gecersiz mulk ID.");
        Mulk storage mulk = mulkler[mulkID];
        require(
            !kiraciMulkSahibi[msg.sender],
            "Bir kiraci ayni anda birden fazla mulk kiralayamaz."
        );
        require(mulk.kiralandi == false, "Bu mulk zaten kiralandi.");
        require(mulk.sahip != msg.sender, "Kendi mulkunu kiralayamazsin.");
        require(
            _baslangicTarihi < _bitisTarihi,
            "Baslangic tarihi bitis tarihinden once olmalidir."
        );

        mulk.kiralandi = true;
        mulk.kiraci = msg.sender;
        mulk.baslangicTarihi = _baslangicTarihi;
        mulk.bitisTarihi = _bitisTarihi;
        kiraciMulkSahibi[msg.sender] = true;
        kiraciMulk[msg.sender] = mulk;
        emit BasvuruYapildi(msg.sender, mulkID, _baslangicTarihi, _bitisTarihi);
    }

    function kiralamaOnayla(uint256 mulkID) public sadeceSahip {
        require(mulkID < mulkler.length, "Gecersiz mulk ID.");
        Mulk storage mulk = mulkler[mulkID];
        require(mulk.kiralandi, "Bu mulk kiralanmamis.");
        require(
            mulk.sahip == msg.sender,
            "Sadece mulk sahibi kiralamayi onaylayabilir."
        );
        emit KiralamaOnaylandi(msg.sender, mulkID, mulk.kiraci);
    }

    function sozlesmeSonlandir() public {
        Mulk storage mulk = kiraciMulk[msg.sender];
        require(mulk.kiraci == msg.sender, "Bu mulkun kiracisi degilsiniz.");
        require(
            block.timestamp >= mulk.bitisTarihi ||
                block.timestamp + 15 days >= mulk.bitisTarihi,
            "Sozlezme henuz sona ermedi."
        );

        delete kiraciMulk[msg.sender];
        mulk.kiralandi = false;
        mulk.kiraci = address(0);
        mulk.baslangicTarihi = 0;
        mulk.bitisTarihi = 0;
        kiraciMulkSahibi[msg.sender] = false;
        // emit SozlesmeSonlandirildi(msg.sender, mulkler.indexOf(mulk));
    }
}
