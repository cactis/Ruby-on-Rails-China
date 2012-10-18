---
layout: post
title: "Java 的这种 DSA 加密算法用 Ruby 改如何写？"
date: 2012-10-17 22:31
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/2267)
public static String sign(byte[] data, String privateKey) throws Exception {
        // 解密由base64编码的私钥
        byte[] keyBytes = decryptBASE64(privateKey);

        // 构造PKCS8EncodedKeySpec对象
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);

        // KEY_ALGORITHM 指定的加密算法
        KeyFactory keyFactory = KeyFactory.getInstance("DSA");

        // 取私钥匙对象
        PrivateKey priKey = keyFactory.generatePrivate(pkcs8KeySpec);

        // 用私钥对信息生成数字签名
        Signature signature = Signature.getInstance("DSA");
        signature.initSign(priKey);
        signature.update(data);

        return encryptBASE64(signature.sign());
    }

    public static boolean verify(byte[] data, String publicKey, String sign) throws Exception {

        // 解密由base64编码的公钥
        byte[] keyBytes = decryptBASE64(publicKey);

        // 构造X509EncodedKeySpec对象
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);

        // KEY_ALGORITHM 指定的加密算法
        KeyFactory keyFactory = KeyFactory.getInstance("DSA");

        // 取公钥匙对象
        PublicKey pubKey = keyFactory.generatePublic(keySpec);

        Signature signature = Signature.getInstance("DSA");
        signature.initVerify(pubKey);
        signature.update(data);

        // 验证签名是否正常
        return signature.verify(decryptBASE64(sign));
    }

    public static void main(String[] args) throws Exception {
      String privateKey = "MIIBSgIBADCCASsGByqGSM44BAEwggEeAoGBAMMai0rQ+0dTbXjJhesuXbnAIX8bOQAWPG3cv5VDjSUPK5alJWKqtlDrkR2qn+gOKHZELZEhUNX+Zej0x2fRfYMaQ8/GoCm/PUZ79irt/+dg9pkkhUBQ+gPAcpt8vGA/VJHlExgd/vTXiCJyslJFlP6W34rnAnO9lZTIAwF9kXNFAhUA8I+b9ZS1MoHketM8YGPLqR/s3uECgYA+ZqrPhRW5BwOpb46c0x11tAOryfGWrByYYWb6ONjTTKCA1vVcCYEdBr6gNr8noO+xRsUtvlZ2Mar0xi9kwYr2CWBr/bFcvhvjRx7e24s6oC0AGpuwgTFjUkb7LkYcM7tyemLOmCs+Ir8gx+OXjC3ukFWawFnJtbB4BfH81Tk5ZAQWAhQwJA67UTJSe4Ft6eg7bEKGOQx/OA==";
      String publicKey = "MIIBtjCCASsGByqGSM44BAEwggEeAoGBAMMai0rQ+0dTbXjJhesuXbnAIX8bOQAWPG3cv5VDjSUPK5alJWKqtlDrkR2qn+gOKHZELZEhUNX+Zej0x2fRfYMaQ8/GoCm/PUZ79irt/+dg9pkkhUBQ+gPAcpt8vGA/VJHlExgd/vTXiCJyslJFlP6W34rnAnO9lZTIAwF9kXNFAhUA8I+b9ZS1MoHketM8YGPLqR/s3uECgYA+ZqrPhRW5BwOpb46c0x11tAOryfGWrByYYWb6ONjTTKCA1vVcCYEdBr6gNr8noO+xRsUtvlZ2Mar0xi9kwYr2CWBr/bFcvhvjRx7e24s6oC0AGpuwgTFjUkb7LkYcM7tyemLOmCs+Ir8gx+OXjC3ukFWawFnJtbB4BfH81Tk5ZAOBhAACgYAtBXiK0XxLdhqhk2u/lh/xMpGIzlgAp+recKY9DHZI+DQidhFMNrAxzw3ptlKfV4jZeDallOMWe55m/Dn6EmP74BPzot1i+Pcz3VvQ0W5ts1QrR6A1w/STwP9RXKWERnV+YjMhyzWx39E9cDxeZMo0zonlqTjYAPI4+kDVhjU4uQ==";

      // 加密
      String signResult = sign(data, privateKey);
      // 加密验证
      boolean status = verify(data, publicKey, signResult); 
    }

* * * * *

我叉，这玩意儿我昨天研究了一下午， Ruby 的 OpenSSL DSA 库的用法和 Java
的非常不同。

[http://ruby-doc.org/stdlib-1.9.3/libdoc/openssl/rdoc/OpenSSL/PKey/DSA.html](http://ruby-doc.org/stdlib-1.9.3/libdoc/openssl/rdoc/OpenSSL/PKey/DSA.html)

#### Private Key 的生成是这么出来的：

    $ openssl dsaparam -rand -genkey -out dsa.pem 1024
    $ openssl dsaparam -noout -text -in dsa.pem
    $ openssl gendsa -des3 -out ca.key dsa.pem
    $ openssl dsa -noout -text -in ca.key
    $ cat ca.key

    -----BEGIN DSA PRIVATE KEY-----
    Proc-Type: 4,ENCRYPTED
    DEK-Info: DES-EDE3-CBC,45C63797FDBBA034

    Hp/mU7/jPnMmUcL7KEcnoRo654KM+gHetJHAIEuUgEjCS7RSLHh1f7URfr+TZYLv
    vkTA8iQoDWtVPJ59lH1IKYPlEkbsBnu/wuI4W5L1V119x7YPzrLrP/eXG5p8FPZ1
    k6M2H3XHzQW1eZD2ejJ1zD6MVkoXyLT0w/jNy1F6PcnhmMP7Vwfm/ALlXR4SILsK
    I1YhnF0QRH2udrpbm09vGvUtay/Km3R1YtM+GJWT8IqQmR5Ju2LxPp3lRND7FdV9
    o2bix3ehyz7sOS8Sam5I6U8D22glZBXX0zbDFHwckItSp7FquqAkFQ2J0cFAE4vR
    0sckKpFcRd9wa6uhXumj3bBhmJcf9IN8BqbCly2gY8c/G08uF3dCdOXwdkCj1ack
    hNHPFtywKNgv9zxzk2cA0o6ZvdAvxwKHKHJU1QsWkW5o0vOjEC8XFIJTf+2L0Obu
    xJqAoqSWFPtn1sfjqtxRGuc+HV+P5sNetToyJ6Yu+cAGR77M336+l5k5KkvoYLAc
    YfIgjNh3TC3HQiNQBr1JsW5WKSljyudoYL/s7wUXCHrxy74bXJ569OBnqrUjOoJ3
    xBYA1tRk91aZ5SSHWraD1g==
    -----END DSA PRIVATE KEY-----

看 Ruby OpenSSL::PKey::DSA 的文档，与 Java 对应的似乎是 `syssign` 方法和
`sysverify` 这两个方法，我尝试用他们，但是：

`ca.key` 可以用 DSA 类 加载进来

    irb> priv_key = OpenSSL::PKey::DSA.new(File.read("ca.key"), "密码")

但是 `dsa.pem` 就不行

    irb>pub_key = OpenSSL::PKey::DSA.new(File.read("dsa.pem"), "密码")
    OpenSSL::PKey::DSAError: Neither PUB key nor PRIV key

并且 priv\_key 加载进来以后 `syssign` 方法传入进去提示内容过大

    irb> priv_key.syssign("this is a demo string")
    OpenSSL::PKey::DSAError: data too large for key size

是需要另外加密一下字符么？但是我不清楚 Java 是怎么做的，就没法与之对应...
