#!/usr/bin/env python

import matplotlib.pyplot as plt
import numpy as np
import math


hash_rate_js_miner = [[429.3688278231,429.55326460481103,429.03724043246956,430.40371868812946,430.0890284288848,429.95958379912287,429.55326460481103,430.2185510239202,430.31111493609876, 429.9410980695645, 430.2000430200043, 429.88565041698905, 429.55326460481103, 427.60626015564867, 428.3755997258396, 430.7930900788352, 430.16303178904803, 429.9410980695645, 430.1815366084487, 430.5148958153952, 429.79326943740057, 430.5705059203445, 430.5705059203445, 430.1075268817204, 430.1260269258893, 429.7009281540048, 430.5148958153952, 430.2000430200043, 430.40371868812946, 430.3296324984939, 430.66322136089576, 429.978071118373, 430.05203629639186, 430.44077134986225, 430.6817692407081, 430.2000430200043, 430.1075268817204, 430.3296324984939, 429.79326943740057, 429.978071118373, 429.99656002751976, 430.42224422158137, 430.05203629639186, 430.1260269258893, 429.77479800584496, 430.01505052676845, 430.7559767391773, 430.070531567177, 430.36667240488896, 430.070531567177, 430.2000430200043, 429.8486932599725, 429.5163645734903, 429.77479800584496, 429.9410980695645, 430.05203629639186, 430.070531567177, 430.070531567177, 427.89901583226356, 429.9226139294927, 425.4051984515251, 429.99656002751976, 429.46102641185314, 429.62708369135595, 430.25557180965495, 430.34815165468865, 429.6455424274973, 430.25557180965495, 430.25557180965495, 430.03354261632404, 429.95958379912287, 429.7009281540048, 430.23706062040185, 430.42224422158137, 430.05203629639186, 430.16303178904803, 429.9041313787026, 430.070531567177, 430.45930007317804, 423.405876873571],
[433.99010502560543,436.7575122292103,438.09690703583635,441.306266548985,444.01030103898404,445.49382991045576,448.1290611696168,449.68072668405426,451.6711833785005, 453.7822752643282, 455.1868542036506, 456.5167769915544, 458.16915605241456, 459.1789879695105, 460.2991944764097, 461.78711613945967, 463.306152705708, 463.7573621481241, 464.25255338904367, 465.3110604439068, 466.3961568956672, 466.9188028201895, 467.4207721791156, 468.3182690956774, 468.95516788595006, 469.43948924983573, 470.14574518100613, 470.18995674252403, 471.2091226086137, 471.43126532151615, 471.8984474541079, 472.2550177095631, 472.1881197469072, 472.79088459174505, 472.85795347077743, 473.64183204660634, 473.73158368468427, 474.0235115661737, 474.20333839150226, 473.9111890431733, 474.4508231721782, 474.00104280229414, 474.31579945928, 475.37554668187863, 474.6535029428518, 474.74363843524503, 474.81126252314704, 475.37554668187863, 474.9014579474759, 475.4659566375047, 475.7373929590866, 475.42074736141484, 474.4733345985955, 473.77647226038755, 476.0997905160922, 475.55640098915734, 476.0997905160922, 476.0997905160922, 475.9638267491671, 476.16780153326033, 475.9185227489054, 476.14512903532994, 476.0771244941681, 476.3492592769018, 476.0544606302961, 476.25851312092203, 476.4173415912339, 475.71476142904714, 476.71258997950133, 476.28119641836537, 475.8958739827725, 476.4854433697051, 476.0317989241682, 476.66714333381, 476.009139375476, 476.32656949604643, 476.7353165522502, 476.14512903532994, 476.44004002096335, 476.32656949604643],
[429.6824646586173,440.6256884776383,445.2359750667854,450.57222672794455,455.85084560331853,460.9356994699239,465.1379133913205,469.593801361822,473.68670361422954, 477.2130756382725, 480.5151122002787, 483.86316349736296, 486.9734599464329, 490.4124368593988, 492.95080350980976, 496.20403910087833, 499.10161708923937, 501.55481994181963, 503.34725927417327, 505.4589567327133, 507.0993914807302, 508.41425593573643, 510.07396072430504, 512.2425980944575, 513.5315565141478, 514.6415521589213, 515.9692482328054, 517.6251358765982, 515.5702206640544, 517.9200331468821, 518.6452984803693, 516.9027189083014, 520.8604614823689, 521.5123859191656, 521.6484089723526, 523.0672664504656, 523.6698785085882, 523.6150382238978, 524.5213742460005, 522.6025607525477, 521.7845030002609, 522.9851995188536, 522.9578495973225, 525.8176464402145, 526.7871253226571, 527.0647762610025, 527.1759186040382, 527.4539796402764, 526.8981505874915, 528.5691632750146, 528.1225244256667, 528.2341133590407, 528.3178360101437, 529.1845266444409, 525.4860746190226, 528.4853609555015, 529.6049147336087, 529.1005291005291, 529.4086505373498, 529.436679373147, 529.4927459493805, 529.296564865294, 529.7451925623775, 530.1383661135557, 530.2226935312832, 530.2508086324832, 530.0259712725923, 530.7855626326964, 529.6049147336087, 530.8419152776304, 530.2226935312832, 530.2508086324832, 530.7573907966669, 530.6165764618487, 530.6165764618487, 530.4476978569913, 531.0392438001169, 530.5602716468591, 530.6447333510215, 525.4308532997057],
[434.51811940557917,443.63604099197016,457.6449590407762,465.8529768005218,474.18085257717286,481.6259692722632,489.2607270414404,496.45037978454053,503.27126321087064, 510.5166428425566, 516.4755707055057, 521.7845030002609, 528.0388636603655, 530.7010560951016, 540.0734499891986, 545.3752181500873, 549.8130635583901, 552.883286338254, 557.6622797233996, 561.1042531702391, 564.8121999435187, 567.9559266200943, 571.5592135345222, 574.6465923457074, 576.3356578871535, 578.7706910522052, 582.0382981200163, 583.0223880597015, 585.6515373352855, 588.3391186680002, 589.7965202005308, 590.7372400756143, 591.6459590580996, 594.3536404160475, 595.3089653530183, 595.9830740806962, 598.3724269985639, 598.7306909352174, 598.5156811108451, 599.9880002399951, 601.8295618680789, 602.627455706882, 603.3546518643659, 600.3482019571352, 600.0600060006001, 601.1060351045925, 603.0271965265633, 603.7553583288051, 602.7727546714889, 604.6314771146987, 605.2536012589276, 604.1565973900435, 604.5583701106342, 605.840300496789, 605.3635207942369, 605.913717886573, 605.5468087683178, 606.7592985862509, 606.7592985862509, 611.1722283339444, 609.7560975609756, 609.6817461285209, 609.3845216331505, 609.7932800780536, 611.8453255017131, 610.1653548111539, 611.5085916957133, 610.4260774020265, 611.3964294448521, 611.7330397014742, 612.5574272588055, 611.8827632625589, 611.807892321811, 610.8735491753207, 610.7616197398156, 612.7826459954655, 611.5085916957133, 611.3590511707527, 611.7330397014742, 611.1722283339444],
[434.6314325452016,448.18931516672643,468.8232536333802,479.13372622298886,489.33255040125266,501.65546302799237,512.1114354483535,522.875816993464,532.5380764724678,541.741156075627,552.4861878453039,559.6284067379261,570.1254275940707,578.2686636211183,584.8637267516668,594.2476824340384,599.736116108912,606.6120715802244,611.1722283339444,618.5056902523503,624.687656171914,630.159430335875,635.00127000254,639.1818472355385,633.2721170286873,645.0780544445878,649.308486461918,652.9546196539341,655.1791915088777,659.8482349059716,661.3319224918987,668.0919294494923,670.9608158883522,673.9452756436177,675.812664729337,677.9201410073892,678.794461037198,676.7273465520742,681.5238874122538,678.84054035707,683.5737234260714,687.6633200385091,690.894016857814,692.2331441229405,686.2475981334065,692.8086462519052,695.2169076751948,697.885407216135,698.714365567356,699.6431819771916,699.741095794556,700.4272606289837,702.5925665706457,701.8528916339135,703.135986499789,702.3951675212475,705.0694493407601,703.4822370735139,704.4734061289187,704.6223224351747,705.6665020111495,705.5171440666008,707.263597142655,706.5140596297866,706.0650992021465,706.3643427279791,708.1651441116069,706.3643427279791,706.6638400113067,708.7172218284904,706.4641469445426,708.9684509039347,709.2198581560284,709.1192738618636,704.7216349541931,705.1688879486637,707.9144839303411,705.5171440666008,705.8159232072276,707.6640011322623],
[440.4510218463707,448.67193108399135,464.64083263637207,481.6491667469415,498.4547901505333,513.0573085013596,528.1225244256667,542.1817393190197,555.2162567319972, 570.3205201323143, 583.2264084917765, 595.3444067392987, 607.8657832350617, 620.3473945409429, 630.2388605281402, 641.9309282321221, 650.110518788194, 662.6905235255136, 672.0430107526881, 681.5238874122538, 689.797889218459, 699.4963626189144, 707.1135624381276, 714.9495960534782, 722.334585379948, 728.4382284382284, 736.4312541424257, 740.4664938911515, 746.2129691814043, 749.512816669165, 755.7436517533254, 762.2532205198567, 764.2922653622745, 770.00077000077, 774.5333436604446, 776.8800497203232, 779.3017456359103, 784.6829880728186, 787.5255945818238, 788.0841673890772, 791.7656373713381, 792.5186241876684, 795.671546785487, 797.7662544874352, 798.8496564946477, 802.3106546854942, 803.4709946970914, 805.9316569954868, 806.4516129032259, 808.3420903726457, 808.9305937550558, 809.3889113719142, 811.4907084313885, 812.2157244964262, 810.7669855683476, 813.6034496786266, 813.5372600065083, 816.7265599477296, 815.3946510110894, 815.9934720522235, 811.0300081103001, 812.8759551292474, 815.9934720522235, 816.5931732810715, 816.2598971512529, 817.2605426610003, 816.7932696234583, 816.9267216730659, 815.9934720522235, 816.5931732810715, 816.7932696234583, 813.4049129656743, 811.9519324455993, 815.1952392598027, 820.8158909956497, 818.5985592665356, 821.8952905399852, 821.0854749979472, 820.3445447087777, 822.3007976317738],
[440.0052800633608,457.81257153321434,476.009139375476,494.6821667078902,514.0066820868672,532.5380764724678,551.7545795630103,571.2327202102136,588.7547836326171, 607.6072426783328, 624.8437890527368, 644.7868979302341, 660.9822195782934, 678.5641582411617, 695.6037840845854, 710.0759781296598, 725.9528130671507, 740.905386382159, 756.7731194187983, 770.1786814540974, 784.7445656438829, 796.1149590000796, 808.7343307723413, 823.3163181294254, 834.0979230961715, 844.3093549476529, 852.2969402539845, 863.9308855291576, 874.6610688358261, 882.4567596187787, 888.651915044877, 898.7148377819717, 900.9009009009009, 912.1590805436467, 919.2866335723478, 923.0201218386561, 930.3190994511118, 935.9790340696368, 936.768149882904, 943.930526713234, 947.2387989012029, 952.6531389920929, 955.1098376313277, 958.8647041902389, 961.4460148062686, 968.1479330041631, 968.9922480620155, 970.4968944099379, 975.3242953281965, 975.7049468240805, 980.0078400627206, 982.3182711198428, 983.2841691248772, 986.5824782951854, 987.7518767285658, 986.7771857114662, 960.9840476648088, 966.5571235260004, 979.1442279447762, 975.8953840148337, 993.7394415184339, 979.4319294809012, 977.9951100244499, 988.2399446585631, 981.8360333824252, 987.5567845151097, 992.7529038022435, 991.8666931164452, 1004.0160642570281, 1007.1507704703394, 1005.2271813429835, 1006.238679814852, 1003.4115994380894, 1008.3694665725521, 1008.6746015735324, 1004.6212577858148, 1006.238679814852, 1008.7763542822556, 1009.8969905069683, 1005.4293183189221],
[439.6570674873598,463.95100677368464,484.8955050186685,506.3291139240506,518.3764449743403,551.1160099200882,575.2746936662256,600.6727534839019,623.558022073954, 648.8450558006748, 672.7211570803902, 698.7631891551953, 720.9285559801024, 754.8309178743962, 776.3372408974458, 796.876245119133, 820.7485226526593, 844.3806467955756, 867.7542519958347, 888.0994671403198, 909.6697898662786, 930.0595238095239, 949.3070058857036, 968.3354313934348, 991.4733293674401, 1009.2854259184497, 1024.6951531919253, 1041.9922892570596, 1058.3130489998941, 1070.663811563169, 1083.8933448948624, 1103.2656663724624, 1115.0758251561106, 1125.1125112511252, 1137.7858686995107, 1151.808339092375, 1163.7379262190154, 1175.3643629525152, 1179.9410029498524, 1189.3434823977166, 1199.0407673860911, 1202.3566189731876, 1209.9213551119178, 1221.001221001221, 1219.0661952944045, 1226.391954868776, 1231.527093596059, 1243.4717731907485, 1241.0027302060066, 1243.4717731907485, 1254.7051442910915, 1254.3903662819869, 1262.9451881788332, 1264.0626975097964, 1266.1433274246644, 1268.713524486171, 1272.264631043257, 1275.3475322025251, 1276.6500702157539, 1281.5583749839805, 1286.3390789812195, 1283.2028743744386, 1279.9180852425445, 1288.4937508053085, 1283.3675564681726, 1285.1818532322322, 1293.4937265554263, 1292.156609381057, 1291.9896640826873, 1296.1762799740766, 1295.1690195570523, 1298.1955082435416, 1293.4937265554263, 1293.3264355923436, 1305.4830287206266, 1298.3640612827837, 1300.0520020800832, 1297.5217334890358, 1303.4410844629822, 1300.3901170351105],
[439.5797617477691,469.61585423123887,495.5892556249381,523.8893545683152,551.6936996579499,580.7200929152149,611.920205605189,643.707756678468,674.900452183303, 706.0650992021465, 739.9186089530152, 772.6781023025808, 805.8667096462245, 845.4514710855597, 878.4258608573435, 913.9932364500502, 949.5774380400723, 987.7518767285658, 1021.0332856851132, 1057.4177857671566, 1092.7767457108512, 1113.7097672346586, 1137.009664582149, 1181.3349084465447, 1215.6576707999027, 1245.3300124533, 1281.3941568426449, 1305.1422605063951, 1329.433661260303, 1358.695652173913, 1391.0140492418973, 1410.4372355430185, 1434.1029685931449, 1462.8437682855472, 1481.2620352540364, 1506.2509414068384, 1531.6281206922959, 1540.5946695424434, 1562.5, 1578.531965272297, 1585.5398763278895, 1623.3766233766235, 1642.845408247084, 1657.2754391779913, 1669.170422300117, 1679.5431642593214, 1698.3695652173913, 1701.8379850238257, 1719.6904557179707, 1731.0022503029254, 1740.644038294169, 1747.3353136466887, 1752.2340984755565, 1751.6202487300754, 1760.5633802816903, 1771.1654268508678, 1768.9722271360338, 1783.166904422254, 1793.7219730941704, 1792.7572606669057, 1799.5321216483715, 1803.4265103697026, 1808.3182640144664, 1811.5942028985505, 1812.2508155128671, 1811.2660749864153, 1808.9725036179452, 1818.512456810329, 1818.512456810329, 1827.151470856934, 1822.4895206852561, 1831.5018315018315, 1837.897445322551, 1838.5732671446956, 1834.52577508714, 1840.2649981597351, 1840.9425625920471, 1848.770567572564, 1840.6037180195103, 1842.6386585590567],
[445.31528322052014,474.18085257717286,506.89375506893754,538.9382915656157,576.3024435223605,612.2199093914534,651.1264487563485,688.8475580354068,733.3528894103844, 776.5180928715639, 823.2485387338438, 867.3779165582444, 919.7093718384991, 968.8044952528579, 1016.880211511084, 1074.69102632993, 1129.5606009262397, 1185.9582542694498, 1244.2453651860146, 1287.1669455528381, 1352.813852813853, 1416.22999575131, 1480.3849000740192, 1543.4480629726809, 1603.5920461834507, 1668.0567139282734, 1725.327812284334, 1784.758165268606, 1847.7457501847746, 1894.65706707086, 1970.831690973591, 1993.2230416583614, 2075.5500207555, 2139.03743315508, 2177.2262138036144, 2236.13595706619, 2307.3373327180434, 2335.90282644242, 2381.5194093831865, 2443.195699975568, 2472.7992087042535, 2516.9896803423107, 2563.445270443476, 2594.706798131811, 2632.964718272775, 2669.5141484249866, 2684.5637583892617, 2717.391304347826, 2777.777777777778, 2799.552071668533, 2834.467120181406, 2847.380410022779, 2876.0425654299684, 2899.391127863149, 2917.1528588098017, 2943.773918163085, 2975.304968759298, 2970.8853238265, 2975.304968759298, 3022.0610456331215, 3032.140691328078, 2969.121140142518, 2989.536621823617, 3038.5900941962927, 3007.518796992481, 3040.4378230465186, 3096.934035305048, 3088.326127239037, 3088.326127239037, 3116.2355874104082, 3140.7035175879396, 3154.5741324921137, 3139.717425431711, 3157.562361856647, 3163.555836760519, 3160.5562579013904, 3160.5562579013904, 3170.577045022194, 3170.577045022194, 3170.577045022194],
[447.4072748422889,482.50904704463215,518.2689816014512,557.8178167010655,597.9788315493632,643.8735432361085,688.2312456985546,739.9186089530152,793.9028262940616, 853.7522410996329, 909.2562284051645, 976.7532721234616, 1042.6441455531228, 1116.9440411035407, 1200.0480019200768, 1285.3470437017995, 1366.867140513942, 1463.057790782736, 1561.5240474703312, 1669.727834362999, 1781.8959372772629, 1896.0940462646947, 2013.693113169553, 2155.1724137931033, 2286.75966155957, 2437.8352023403218, 2580.6451612903224, 2738.225629791895, 2885.1702250432772, 3053.4351145038167, 3222.6877215597806, 3397.8933061501866, 3599.712023038157, 3773.584905660377, 3977.7247414478916, 4158.004158004158, 4397.537379067722, 4564.125969876769, 4789.272030651341, 5010.0200400801605, 5181.347150259067, 5399.5680345572355, 5608.524957936063, 5807.200929152149, 6042.296072507553, 6253.908692933083, 6443.298969072165, 6657.789613848202, 6906.077348066297, 7082.15297450425, 7235.890014471781, 7412.898443291328, 7662.835249042146, 7836.990595611286, 8025.6821829855535, 8116.883116883117, 8298.755186721992, 8445.945945945945, 8650.519031141868, 8764.241893076249, 8841.732979664013, 9049.773755656108, 9124.087591240876, 9267.840593141798, 9345.794392523365, 9496.67616334283, 9596.928982725527, 9699.321047526673, 9784.735812133073, 9920.63492063492, 10000, 10030.090270812438, 10121.457489878543, 10288.0658436214, 10183.299389002037, 10351.966873706004, 10351.966873706004, 10526.315789473683, 10559.662090813094, 10626.992561105208]]

cache_hit_rate_js_miner = [[0]*80,
[0.0039421875,0.0110296875,0.0175578125,0.0237328125,0.02944375,0.0343984375,0.0396453125,0.043221875,0.0474296875, 0.0516875, 0.0553625, 0.05808125, 0.0612171875, 0.0643375, 0.0662765625, 0.069021875, 0.0717796875, 0.0738265625, 0.07500625, 0.0764859375, 0.0787078125, 0.0804015625, 0.0818125, 0.0834640625, 0.084134375, 0.0855515625, 0.0867625, 0.08753203125, 0.0887140625, 0.0891390625, 0.0902421875, 0.090928125, 0.090946875, 0.091996875, 0.092784375, 0.093275, 0.0938625, 0.094065625, 0.0945328125, 0.0949546875, 0.0953390625, 0.09578125, 0.09661875, 0.0968140625, 0.09710625, 0.097053125, 0.096971875, 0.0979234375, 0.0975765625, 0.0973921875, 0.0982109375, 0.0984875, 0.09801875, 0.098215625, 0.0982875, 0.098509375, 0.098496875, 0.0991, 0.09930625, 0.0986875, 0.098621875, 0.0991671875, 0.0990265625, 0.0990484375, 0.0990578125, 0.0988203125, 0.0991609375, 0.0986328125, 0.100028125, 0.0994640625, 0.0991140625, 0.0992375, 0.0993578125, 0.0999125, 0.0995953125, 0.0997015625, 0.09994375, 0.0997953125, 0.0994875, 0.0995515625],
[0.0081890625,0.0223390625,0.035434375,0.0475171875,0.05895,0.069196875,0.07847109375,0.0869984375,0.0958, 0.1038640625, 0.1096671875, 0.11626796875, 0.122740625, 0.1282296875, 0.1336484375, 0.13835703125, 0.1435078125, 0.147940625, 0.1513515625, 0.1547890625, 0.1584046875, 0.1617609375, 0.163590625, 0.166328125, 0.1689234375, 0.1711703125, 0.173578125, 0.17535859375, 0.176959375, 0.1788484375, 0.1805328125, 0.18300625, 0.1841515625, 0.18413046875, 0.1849328125, 0.18663125, 0.1880328125, 0.1880578125, 0.1894875, 0.19091640625, 0.190828125, 0.19205, 0.1916640625, 0.1917734375, 0.1942421875, 0.19356875, 0.19459375, 0.1945453125, 0.194484375, 0.1958546875, 0.19490390625, 0.1957640625, 0.1960828125, 0.197165625, 0.1969015625, 0.1968265625, 0.198075, 0.1977578125, 0.1975734375, 0.197825, 0.1980171875, 0.1976421875, 0.198165625, 0.1987078125, 0.199090625, 0.1989453125, 0.19850703125, 0.19969375, 0.198484375, 0.1990265625, 0.1985921875, 0.19935, 0.19915625, 0.1987140625, 0.1994546875, 0.199775, 0.199834375, 0.1993703125, 0.1996046875, 0.1991515625],
[0.0127234375,0.0333859375,0.052928125,0.07116875,0.087846875,0.10298671875,0.1174359375,0.130728125,0.143059375, 0.15516875, 0.165640625, 0.17551875, 0.1844546875, 0.1925, 0.200175, 0.207596875, 0.2155328125, 0.2209953125, 0.2266546875, 0.2322515625, 0.23786875, 0.24108125, 0.2462765625, 0.2506390625, 0.253403125, 0.256659375, 0.26036875, 0.263603125, 0.265509375, 0.2689203125, 0.2712859375, 0.273340625, 0.2739859375, 0.2770015625, 0.278165625, 0.2796234375, 0.2815234375, 0.28269375, 0.2830765625, 0.28500625, 0.286225, 0.2876734375, 0.288875, 0.29005, 0.2889546875, 0.290721875, 0.291728125, 0.2918703125, 0.292365625, 0.2927375, 0.2939578125, 0.293709375, 0.294690625, 0.2949671875, 0.2948421875, 0.29580625, 0.2950125, 0.2970296875, 0.2954, 0.2975203125, 0.2967984375, 0.2969703125, 0.2973484375, 0.296503125, 0.2985875, 0.2976703125, 0.29860625, 0.297746875, 0.2988359375, 0.298915625, 0.2995890625, 0.298753125, 0.298465625, 0.2991171875, 0.297846875, 0.2998546875, 0.2984796875, 0.2989625, 0.299346875, 0.2986109375],
[0.0168046875,0.04455625,0.07120625,0.0949578125,0.1166390625,0.138296875,0.1565734375,0.17483125,0.1912953125, 0.205446875, 0.2207578125, 0.2331125, 0.24607734375, 0.257103125, 0.2666109375, 0.27839375, 0.2856375, 0.294628125, 0.3025734375, 0.3093578125, 0.3159703125, 0.3219671875, 0.3278, 0.3323828125, 0.338271875, 0.34242265625, 0.3467390625, 0.350759375, 0.3533, 0.3571046875, 0.3612734375, 0.3627375, 0.3653921875, 0.3685421875, 0.3699421875, 0.3729109375, 0.3746609375, 0.376978125, 0.3785015625, 0.3786984375, 0.381490625, 0.3823171875, 0.3850046875, 0.3866796875, 0.3865890625, 0.3865671875, 0.38823125, 0.38935, 0.3905734375, 0.391115625, 0.390721875, 0.3912640625, 0.3936875, 0.392, 0.393840625, 0.392871875, 0.3950171875, 0.394159375, 0.395284375, 0.3949765625, 0.39635, 0.396975, 0.3972859375, 0.39645625, 0.396240625, 0.396746875, 0.3985375, 0.3971703125, 0.3970609375, 0.39799921875, 0.3978359375, 0.398509375, 0.398590625, 0.398890625, 0.3982421875, 0.3998546875, 0.3983515625, 0.3982328125, 0.39985625, 0.3985109375],
[0.0200453125,0.0563359375,0.088903125,0.1185203125,0.14674375,0.1720953125,0.196809375,0.2185109375,0.2396125, 0.25833125, 0.27695625, 0.2921140625, 0.307259375, 0.32145625, 0.33469375, 0.3458125, 0.3570125, 0.3678109375, 0.37825625, 0.38583125, 0.39504921875, 0.403253125, 0.4102609375, 0.417271875, 0.4233125, 0.42845, 0.4347484375, 0.4382703125, 0.4428109375, 0.4469921875, 0.4501203125, 0.455109375, 0.4570625, 0.4606765625, 0.4641078125, 0.46618125, 0.4678453125, 0.4716734375, 0.4733890625, 0.4748609375, 0.47673125, 0.477421875, 0.47955625, 0.481440625, 0.482496875, 0.484703125, 0.4850421875, 0.487128125, 0.4877125, 0.4888375, 0.48904375, 0.4899203125, 0.4911015625, 0.491165625, 0.491196875, 0.492721875, 0.4920328125, 0.4942171875, 0.4935859375, 0.494865625, 0.4951671875, 0.4962109375, 0.4963953125, 0.496428125, 0.496434375, 0.4969640625, 0.49686875, 0.4969078125, 0.4971921875, 0.49746875, 0.498365625, 0.4973375, 0.4971125, 0.498590625, 0.498221875, 0.4971109375, 0.498790625, 0.498609375, 0.497834375, 0.4996375],
[0.025165625,0.066309375,0.1058765625,0.1418984375,0.1760390625,0.2055375,0.234903125,0.262753125,0.285975, 0.3094453125, 0.3302796875, 0.3513109375, 0.3688546875, 0.3854203125, 0.401978125, 0.415046875, 0.4297296875, 0.4411828125, 0.453675, 0.4639078125, 0.474353125, 0.483228125, 0.49164375, 0.500925, 0.5079203125, 0.514128125, 0.5199890625, 0.5267890625, 0.532165625, 0.5370140625, 0.5406640625, 0.546028125, 0.54841875, 0.5535671875, 0.5575609375, 0.559509375, 0.562521875, 0.5657921875, 0.5675015625, 0.5706234375, 0.5715671875, 0.574425, 0.5758546875, 0.5773546875, 0.579140625, 0.58226875, 0.58225, 0.582909375, 0.58465078125, 0.5854328125, 0.5878234375, 0.5882671875, 0.588278125, 0.5896953125, 0.5904171875, 0.5897671875, 0.5912546875, 0.592321875, 0.593, 0.5929546875, 0.595090625, 0.5940890625, 0.594321875, 0.5952078125, 0.5948828125, 0.595778125, 0.596690625, 0.5966484375, 0.5965078125, 0.597896875, 0.597396875, 0.5978453125, 0.59676875, 0.5978453125, 0.598846875, 0.598190625, 0.5975625, 0.59899375, 0.59861875, 0.59857421875],
[0.028659375,0.07894375,0.123334375,0.16580625,0.204459375,0.2404375,0.2742765625,0.3051609375,0.333665625, 0.3613625, 0.38658046875, 0.4087578125, 0.4304171875, 0.4508875, 0.4678796875, 0.484315625, 0.50034375, 0.5158171875, 0.5297859375, 0.5419703125, 0.5532984375, 0.5646625, 0.5735078125, 0.5823203125, 0.592190625, 0.5999234375, 0.606475, 0.6141078125, 0.620221875, 0.625503125, 0.6309609375, 0.6366125, 0.64066875, 0.644596875, 0.6493015625, 0.653171875, 0.656665625, 0.6607109375, 0.6623375, 0.66540625, 0.669075, 0.6700015625, 0.6724609375, 0.6754609375, 0.6756484375, 0.67741875, 0.67959375, 0.681984375, 0.6817984375, 0.683565625, 0.68546875, 0.6857375, 0.68714375, 0.6886515625, 0.6886671875, 0.6894859375, 0.69033125, 0.6907328125, 0.691959375, 0.692834375, 0.693559375, 0.6935546875, 0.69350625, 0.69476875, 0.6941546875, 0.6952546875, 0.696253125, 0.6965, 0.69591875, 0.6973484375, 0.696834375, 0.69736875, 0.69765625, 0.6979921875, 0.6986546875, 0.6979671875, 0.6977328125, 0.697475, 0.6986703125, 0.697784375],
[0.0337609375,0.0893109375,0.141321875,0.190040625,0.2333984375,0.2737203125,0.31316875,0.3490796875,0.38230078125, 0.4120796875, 0.4411671875, 0.4673953125, 0.4921453125, 0.5148375, 0.53539375, 0.5541765625, 0.5733171875, 0.58939375, 0.6049015625, 0.6189734375, 0.6326046875, 0.6438765625, 0.65487109375, 0.6667984375, 0.6762953125, 0.68464609375, 0.695090625, 0.7005359375, 0.7079078125, 0.71425, 0.72209140625, 0.7265375, 0.7321609375, 0.7373046875, 0.7423515625, 0.745528125, 0.749765625, 0.7528484375, 0.756696875, 0.7606109375, 0.76348125, 0.76551875, 0.768259375, 0.770990625, 0.77257265625, 0.7749484375, 0.7775140625, 0.7785890625, 0.7805375, 0.781675, 0.7831296875, 0.78464375, 0.7856171875, 0.785696875, 0.787525, 0.788340625, 0.7892890625, 0.790359375, 0.7911984375, 0.79180078125, 0.792515625, 0.79266875, 0.793553125, 0.7940171875, 0.79355625, 0.79475, 0.793684375, 0.7950015625, 0.7956015625, 0.795928125, 0.796071875, 0.7965453125, 0.79759296875, 0.79726875, 0.79683125, 0.7974515625, 0.7975234375, 0.79873125, 0.7975953125, 0.7980390625],
[0.0371703125,0.100478125,0.158559375,0.213175,0.263628125,0.31019375,0.3530609375,0.39106875,0.43141640625, 0.463990625, 0.496690625, 0.524546875, 0.5534765625, 0.57909375, 0.6021859375, 0.625028125, 0.6439859375, 0.6631546875, 0.680221875, 0.69519375, 0.7104515625, 0.724275, 0.738153125, 0.7493640625, 0.7605015625, 0.7710625, 0.7800296875, 0.7891765625, 0.7972546875, 0.8052640625, 0.8121359375, 0.8172890625, 0.8243921875, 0.8302984375, 0.8342390625, 0.839078125, 0.844959375, 0.848865625, 0.851534375, 0.8559421875, 0.8586625, 0.8609890625, 0.8644265625, 0.86709375, 0.8687640625, 0.8711984375, 0.8740140625, 0.8754125, 0.8777453125, 0.878971875, 0.88129375, 0.88160625, 0.8831484375, 0.884346875, 0.8858765625, 0.8865421875, 0.8880296875, 0.8883734375, 0.888375, 0.890359375, 0.891053125, 0.8913078125, 0.892328125, 0.8930796875, 0.8933671875, 0.8941890625, 0.8943703125, 0.8941203125, 0.89445, 0.8951609375, 0.896125, 0.896640625, 0.89606875, 0.8970359375, 0.8971171875, 0.89696875, 0.89706875, 0.89775, 0.8973703125, 0.897521875],
[0.0413421875,0.1118453125,0.17560703125,0.237015625,0.2924421875,0.3453171875,0.3924859375,0.4363796875,0.4778140625, 0.5172515625, 0.550175, 0.583484375, 0.6145046875, 0.642190625, 0.669753125, 0.6933921875, 0.7155171875, 0.7356921875, 0.7557296875, 0.7737828125, 0.790234375, 0.8053921875, 0.819153125, 0.8330359375, 0.8452640625, 0.8562140625, 0.8669703125, 0.87693125, 0.885490625, 0.8937359375, 0.901684375, 0.9094265625, 0.91600625, 0.921725, 0.927703125, 0.9325890625, 0.9381484375, 0.9421515625, 0.94664375, 0.9507046875, 0.9537484375, 0.9574859375, 0.9606265625, 0.9631921875, 0.9660171875, 0.9683984375, 0.970665625, 0.97280625, 0.97526875, 0.9767, 0.978971875, 0.980175, 0.9817125, 0.9830296875, 0.9842703125, 0.985196875, 0.986265625, 0.987365625, 0.98839375, 0.9893046875, 0.9897625, 0.9907484375, 0.991290625, 0.992034375, 0.9924578125, 0.993090625, 0.993546875, 0.99413125, 0.9944109375, 0.9950984375, 0.995296875, 0.9955609375, 0.995996875, 0.9963375, 0.9965875, 0.996759375, 0.99696875, 0.9972484375, 0.9975890625, 0.9976625]
]

plt.imshow(hash_rate_js_miner, cmap='binary',interpolation='nearest')
plt.show()

plt.imshow(cache_hit_rate_js_miner, cmap='binary',interpolation='nearest')
plt.show()

hash_js_list = list()
cache_js_list = list()

for c,h in zip(cache_hit_rate_js_miner,hash_rate_js_miner):
	cache_js_list.extend(c)
	hash_js_list.extend(h)

plt.plot(cache_js_list,hash_js_list,'ro')
plt.xlabel('buffer hit rate')
plt.ylabel('hash rate')
plt.show()